import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaBalanceScale, FaArrowRight, FaHistory, FaInfoCircle } from 'react-icons/fa';

const MatchingTracker = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [legs, setLegs] = useState(null);
  const [matchingHistory, setMatchingHistory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch binary legs
      const legsRes = await mlmAPI.getBinaryLegs(username);
      if (legsRes.success) {
        setLegs(legsRes.legs);
      }

      // Fetch matching history
      const matchingRes = await mlmAPI.getMatchingHistory(username);
      if (matchingRes.success) {
        setMatchingHistory(matchingRes.matches || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalMatched = () => {
    return matchingHistory.reduce((sum, m) => sum + parseFloat(m.matched_volume), 0);
  };

  const getTotalBonus = () => {
    return matchingHistory.reduce((sum, m) => sum + parseFloat(m.bonus_amount), 0);
  };

  const getWeakerLeg = () => {
    if (!legs) return null;
    const leftVol = parseFloat(legs.left_volume || 0);
    const rightVol = parseFloat(legs.right_volume || 0);
    return leftVol < rightVol ? 'left' : 'right';
  };

  const getMatchableVolume = () => {
    if (!legs) return 0;
    const leftVol = parseFloat(legs.left_volume || 0);
    const rightVol = parseFloat(legs.right_volume || 0);
    return Math.min(leftVol, rightVol);
  };

  const getCarryForward = (leg) => {
    if (!legs) return 0;
    const leftVol = parseFloat(legs.left_volume || 0);
    const rightVol = parseFloat(legs.right_volume || 0);
    if (leg === 'left') {
      return Math.max(0, leftVol - rightVol);
    } else {
      return Math.max(0, rightVol - leftVol);
    }
  };

  const canMatch = () => {
    if (!legs) return false;
    const leftCount = legs.left_count || 0;
    const rightCount = legs.right_count || 0;
    // Minimum 3 users: 2+1 or 1+2
    return (leftCount >= 2 && rightCount >= 1) || (leftCount >= 1 && rightCount >= 2);
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading matching tracker...</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3">
            <FaBalanceScale className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">Matching Bonus Tracker</h1>
              <p className="opacity-90 mt-1">Track your binary leg volumes and matching bonuses</p>
            </div>
          </div>
        </div>

        {/* Matching Requirements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-500 text-2xl mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">How Matching Bonus Works</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <span className="font-medium">Minimum Requirement:</span> 3 active users (2+1 or 1+2 in your legs)</li>
                <li>• <span className="font-medium">Match Volume:</span> Weaker leg determines the matched volume</li>
                <li>• <span className="font-medium">Bonus Rate:</span> 10% of matched volume</li>
                <li>• <span className="font-medium">Carry Forward:</span> Stronger leg balance carries to next match</li>
                <li>• <span className="font-medium">Auto Credit:</span> Bonus credited to Income Wallet instantly</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Current Matching Status</h3>
          
          {!canMatch() && (
            <div className="bg-yellow-400 text-yellow-900 rounded-lg p-4 mb-4">
              <p className="font-medium">⚠️ Minimum requirement not met</p>
              <p className="text-sm mt-1">
                You need at least 3 users: 2 on one side and 1 on the other
              </p>
              <p className="text-sm mt-2">
                Current: Left {legs?.left_count || 0} users, Right {legs?.right_count || 0} users
              </p>
            </div>
          )}

          {canMatch() && (
            <div className="bg-green-400 text-green-900 rounded-lg p-4 mb-4">
              <p className="font-medium">✓ Eligible for matching bonus</p>
              <p className="text-sm mt-1">
                You have enough users to qualify for matching bonuses
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Matchable Volume</p>
              <p className="text-2xl font-bold">₹{getMatchableVolume().toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-1">Weaker leg: {getWeakerLeg()}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Potential Bonus (10%)</p>
              <p className="text-2xl font-bold">₹{(getMatchableVolume() * 0.1).toLocaleString()}</p>
              <p className="text-xs opacity-75 mt-1">On next match</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <p className="text-sm opacity-90 mb-1">Carry Forward</p>
              <p className="text-2xl font-bold">
                ₹{(getCarryForward('left') + getCarryForward('right')).toLocaleString()}
              </p>
              <p className="text-xs opacity-75 mt-1">Stronger leg balance</p>
            </div>
          </div>
        </div>

        {/* Binary Legs Visual */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Binary Legs Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Leg */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Left Leg</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm opacity-90">Team Size</p>
                  <p className="text-3xl font-bold">{legs?.left_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Volume</p>
                  <p className="text-2xl font-bold">₹{parseFloat(legs?.left_volume || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Carry Forward</p>
                  <p className="text-xl font-bold">₹{getCarryForward('left').toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Balance Icon */}
            <div className="flex flex-col items-center justify-center">
              <FaBalanceScale className="text-6xl text-gray-300 mb-4" />
              <div className="text-center">
                <p className="text-sm text-gray-600">Weaker Leg</p>
                <p className="text-lg font-bold text-purple-600">{getWeakerLeg()?.toUpperCase()}</p>
              </div>
            </div>

            {/* Right Leg */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white">
              <h4 className="text-xl font-bold mb-4">Right Leg</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm opacity-90">Team Size</p>
                  <p className="text-3xl font-bold">{legs?.right_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Volume</p>
                  <p className="text-2xl font-bold">₹{parseFloat(legs?.right_volume || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Carry Forward</p>
                  <p className="text-xl font-bold">₹{getCarryForward('right').toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-600 text-sm font-medium">Total Matches</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">{matchingHistory.length}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Total Matched Volume</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">₹{getTotalMatched().toLocaleString()}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Total Bonus Earned</p>
            <p className="text-2xl font-bold text-green-800 mt-1">₹{getTotalBonus().toLocaleString()}</p>
          </div>
        </div>

        {/* Matching History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaHistory className="text-2xl text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Matching History</h3>
            </div>
          </div>
          <div className="p-6">
            {matchingHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No matching bonuses yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Left Volume</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Right Volume</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matched</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus (10%)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carry Forward</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {matchingHistory.map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(match.matched_at)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">
                          ₹{parseFloat(match.left_volume).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">
                          ₹{parseFloat(match.right_volume).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          ₹{parseFloat(match.matched_volume).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">
                          ₹{parseFloat(match.bonus_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-purple-600">
                          L: ₹{parseFloat(match.left_carry_forward || 0).toLocaleString()}<br/>
                          R: ₹{parseFloat(match.right_carry_forward || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default MatchingTracker;
