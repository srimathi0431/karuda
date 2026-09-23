import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaMoneyBillWave, FaTrophy, FaCalendar } from 'react-icons/fa';

const IncomeReport = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [directBonuses, setDirectBonuses] = useState([]);
  const [matchingHistory, setMatchingHistory] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);

      // Fetch direct bonuses
      const directRes = await mlmAPI.getDirectBonuses(username);
      if (directRes.success) {
        setDirectBonuses(directRes.bonuses || []);
      }

      // Fetch matching history
      const matchingRes = await mlmAPI.getMatchingHistory(username);
      if (matchingRes.success) {
        setMatchingHistory(matchingRes.matches || []);
      }

      // Fetch payout schedule
      const payoutRes = await mlmAPI.getPayoutSchedule(username);
      if (payoutRes.success) {
        setPayouts(payoutRes.payouts || []);
      }
    } catch (error) {
      console.error('Error fetching income data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (items, dateField) => {
    if (dateFilter === 'all') return items;

    const now = new Date();
    return items.filter(item => {
      const itemDate = new Date(item[dateField]);
      
      if (dateFilter === 'today') {
        return itemDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return itemDate >= monthAgo;
      }
      return true;
    });
  };

  const getTotalDirectBonus = () => {
    return filterByDate(directBonuses, 'credited_at').reduce((sum, b) => sum + parseFloat(b.bonus_amount), 0);
  };

  const getTotalMatchingBonus = () => {
    return filterByDate(matchingHistory, 'matched_at').reduce((sum, m) => sum + parseFloat(m.bonus_amount), 0);
  };

  const getTotalMonthlyAwards = () => {
    return payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading income report...</p>
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
            <FaChartLine className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">Income Report</h1>
              <p className="opacity-90 mt-1">Track your earnings from bonuses and awards</p>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <FaCalendar className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Period:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === 'all' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === 'today' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === 'week' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === 'month' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FaMoneyBillWave className="text-3xl" />
              <h3 className="text-lg font-bold">Direct Bonus</h3>
            </div>
            <p className="text-3xl font-bold">₹{getTotalDirectBonus().toLocaleString()}</p>
            <p className="opacity-90 text-sm mt-2">{filterByDate(directBonuses, 'credited_at').length} transactions</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FaMoneyBillWave className="text-3xl" />
              <h3 className="text-lg font-bold">Matching Bonus</h3>
            </div>
            <p className="text-3xl font-bold">₹{getTotalMatchingBonus().toLocaleString()}</p>
            <p className="opacity-90 text-sm mt-2">{filterByDate(matchingHistory, 'matched_at').length} matches</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FaTrophy className="text-3xl" />
              <h3 className="text-lg font-bold">Monthly Awards</h3>
            </div>
            <p className="text-3xl font-bold">₹{getTotalMonthlyAwards().toLocaleString()}</p>
            <p className="opacity-90 text-sm mt-2">{payouts.filter(p => p.status === 'paid').length} payouts received</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Total Earnings ({dateFilter === 'all' ? 'All Time' : dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : 'Last 30 Days'})</h3>
          <p className="text-4xl font-bold">
            ₹{(getTotalDirectBonus() + getTotalMatchingBonus() + (dateFilter === 'all' ? getTotalMonthlyAwards() : 0)).toLocaleString()}
          </p>
        </div>

        {/* Direct Bonus Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Direct Bonus (10%)</h3>
            <p className="text-sm text-gray-600 mt-1">Instant bonus when your direct referrals enroll in packages</p>
          </div>
          <div className="p-6">
            {filterByDate(directBonuses, 'credited_at').length === 0 ? (
              <p className="text-center text-gray-500 py-8">No direct bonuses in this period</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bonus (10%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filterByDate(directBonuses, 'credited_at').map((bonus) => (
                      <tr key={bonus.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(bonus.credited_at)}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{bonus.referred_name}</p>
                          <p className="text-xs text-gray-500">@{bonus.referred_username}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{parseFloat(bonus.package_amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">₹{parseFloat(bonus.bonus_amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Matching Bonus Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Matching Bonus (10%)</h3>
            <p className="text-sm text-gray-600 mt-1">Earn when your left and right teams match volume (minimum 3 users: 2+1 or 1+2)</p>
          </div>
          <div className="p-6">
            {filterByDate(matchingHistory, 'matched_at').length === 0 ? (
              <p className="text-center text-gray-500 py-8">No matching bonuses in this period</p>
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
                    {filterByDate(matchingHistory, 'matched_at').map((match) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(match.matched_at)}</td>
                        <td className="px-4 py-3 text-sm text-blue-600">₹{parseFloat(match.left_volume).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-green-600">₹{parseFloat(match.right_volume).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{parseFloat(match.matched_volume).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">₹{parseFloat(match.bonus_amount).toLocaleString()}</td>
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

        {/* Monthly Payouts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Monthly Award Payouts</h3>
            <p className="text-sm text-gray-600 mt-1">Recurring monthly payouts from Ceiling/Car/Royal achievements</p>
          </div>
          <div className="p-6">
            {payouts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No monthly payouts yet. Achieve milestones to unlock!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achievement</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{payout.payout_month}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {payout.achievement_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">₹{parseFloat(payout.amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payout.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payout.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {payout.paid_at ? formatDate(payout.paid_at) : '-'}
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

export default IncomeReport;
