import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaTrophy, FaCar, FaCheckCircle, FaCrown } from 'react-icons/fa';

const AwardsPage = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState({});
  const [claims, setClaims] = useState([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch achievements
      const achievementsRes = await mlmAPI.getAchievements(username);
      if (achievementsRes.success) {
        setAchievements(achievementsRes.achievements || []);
      }

      // Fetch progress
      const progressRes = await mlmAPI.getProgress(username);
      if (progressRes.success) {
        setProgress(progressRes.progress || {});
      }

      // Fetch claims
      const claimsRes = await mlmAPI.getUserClaims(username);
      if (claimsRes.success) {
        setClaims(claimsRes.claims || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardsData = [
    {
      type: 'binary',
      title: 'Binary Achiever',
      icon: <FaTrophy className="text-5xl text-blue-600" />,
      requirement: '₹50,000 + ₹50,000',
      leftDesc: 'Left Team Volume',
      rightDesc: 'Right Team Volume',
      leftTarget: 50000,
      rightTarget: 50000,
      reward: '₹25,000 One-time',
      description: 'Build ₹50k volume on both left and right teams',
      color: 'from-blue-500 to-blue-700',
      achieved: achievements.some(a => a.achievement_type === 'binary')
    },
    {
      type: 'ceiling',
      title: 'Ceiling Achiever',
      icon: <FaCrown className="text-5xl text-purple-600" />,
      requirement: '5 + 5 Binary Achievers',
      leftDesc: 'Left Binary Achievers',
      rightDesc: 'Right Binary Achievers',
      leftTarget: 5,
      rightTarget: 5,
      reward: '₹11,000/month × 12 months',
      description: 'Have 5 Binary Achievers on each side (all downline)',
      color: 'from-purple-500 to-purple-700',
      achieved: achievements.some(a => a.achievement_type === 'ceiling')
    },
    {
      type: 'car',
      title: 'Car Achiever',
      icon: <FaCar className="text-5xl text-yellow-600" />,
      requirement: '50 + 50 Ceiling Achievers',
      leftDesc: 'Left Ceiling Achievers',
      rightDesc: 'Right Ceiling Achievers',
      leftTarget: 50,
      rightTarget: 50,
      reward: '₹15,000/month × 12 + ₹5L Car',
      description: 'Have 50 Ceiling Achievers on each side (all downline)',
      color: 'from-yellow-500 to-yellow-700',
      achieved: achievements.some(a => a.achievement_type === 'car'),
      claimable: true
    },
    {
      type: 'royal',
      title: 'Royal Car Achiever',
      icon: <FaCar className="text-5xl text-red-600" />,
      requirement: '100 + 100 Ceiling Achievers',
      leftDesc: 'Left Ceiling Achievers',
      rightDesc: 'Right Ceiling Achievers',
      leftTarget: 100,
      rightTarget: 100,
      reward: '₹25,000/month × 12 + ₹10L Car',
      description: 'Have 100 Ceiling Achievers on each side (all downline)',
      color: 'from-red-500 to-red-700',
      achieved: achievements.some(a => a.achievement_type === 'royal_car'),
      claimable: true
    }
  ];

  const getProgressValue = (award) => {
    if (award.type === 'binary') {
      return {
        left: progress.left_volume || 0,
        right: progress.right_volume || 0
      };
    }
    // For other awards, we'd need to track achiever counts
    // This would come from progress API
    return {
      left: progress[`${award.type}_left`] || 0,
      right: progress[`${award.type}_right`] || 0
    };
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleClaimAward = (award) => {
    if (!award.achieved) {
      alert('You have not achieved this award yet');
      return;
    }

    // Check if already claimed
    const alreadyClaimed = claims.some(c => c.award_type === award.type);
    if (alreadyClaimed) {
      alert('You have already claimed this award');
      return;
    }

    setSelectedAward(award);
    setShowClaimModal(true);
  };

  const confirmClaim = async () => {
    try {
      setProcessing(true);

      const awardType = selectedAward.type === 'royal' ? 'royal_car' : selectedAward.type;
      await mlmAPI.claimAward(username, awardType);

      setShowClaimModal(false);
      setShowSuccessModal(true);
      fetchData();
    } catch (error) {
      console.error('Error claiming award:', error);
      alert(error.message || 'Failed to claim award');
    } finally {
      setProcessing(false);
    }
  };

  const getClaimStatus = (awardType) => {
    const claim = claims.find(c => c.award_type === awardType || (awardType === 'royal' && c.award_type === 'royal_car'));
    if (!claim) return null;
    return claim.status;
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
            <p className="text-gray-600">Loading awards...</p>
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
            <FaTrophy className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">Awards & Achievements</h1>
              <p className="opacity-90 mt-1">Track your progress and claim car vouchers</p>
            </div>
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Binary Achiever</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              {achievements.filter(a => a.achievement_type === 'binary').length > 0 ? '✓' : '-'}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-600 text-sm font-medium">Ceiling Achiever</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">
              {achievements.filter(a => a.achievement_type === 'ceiling').length > 0 ? '✓' : '-'}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600 text-sm font-medium">Car Achiever</p>
            <p className="text-2xl font-bold text-yellow-800 mt-1">
              {achievements.filter(a => a.achievement_type === 'car').length > 0 ? '✓' : '-'}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">Royal Car</p>
            <p className="text-2xl font-bold text-red-800 mt-1">
              {achievements.filter(a => a.achievement_type === 'royal_car').length > 0 ? '✓' : '-'}
            </p>
          </div>
        </div>

        {/* Awards Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {awardsData.map((award) => {
            const progressValues = getProgressValue(award);
            const leftProgress = getProgressPercentage(progressValues.left, award.leftTarget);
            const rightProgress = getProgressPercentage(progressValues.right, award.rightTarget);
            const claimStatus = getClaimStatus(award.type);

            return (
              <div key={award.type} className={`bg-gradient-to-br ${award.color} rounded-lg shadow-lg p-6 text-white relative overflow-hidden`}>
                {award.achieved && (
                  <div className="absolute top-4 right-4">
                    <FaCheckCircle className="text-4xl text-white opacity-30" />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    {award.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{award.title}</h3>
                    <p className="opacity-90 text-sm">{award.description}</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                  <p className="text-sm opacity-90 mb-1">Requirement:</p>
                  <p className="font-bold text-lg">{award.requirement}</p>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Left Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{award.leftDesc}</span>
                      <span className="font-bold">
                        {award.type === 'binary' 
                          ? `₹${progressValues.left.toLocaleString()} / ₹${award.leftTarget.toLocaleString()}`
                          : `${progressValues.left} / ${award.leftTarget}`}
                      </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                      <div
                        className="bg-white h-3 rounded-full transition-all"
                        style={{ width: `${leftProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Right Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{award.rightDesc}</span>
                      <span className="font-bold">
                        {award.type === 'binary' 
                          ? `₹${progressValues.right.toLocaleString()} / ₹${award.rightTarget.toLocaleString()}`
                          : `${progressValues.right} / ${award.rightTarget}`}
                      </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                      <div
                        className="bg-white h-3 rounded-full transition-all"
                        style={{ width: `${rightProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                  <p className="text-sm opacity-90 mb-1">Reward:</p>
                  <p className="font-bold text-xl">{award.reward}</p>
                </div>

                {/* Claim Button */}
                {award.claimable && (
                  <>
                    {!award.achieved && (
                      <button
                        disabled
                        className="w-full py-3 bg-white bg-opacity-20 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
                      >
                        Not Achieved Yet
                      </button>
                    )}
                    {award.achieved && !claimStatus && (
                      <button
                        onClick={() => handleClaimAward(award)}
                        className="w-full py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaCar />
                        Claim Car Voucher
                      </button>
                    )}
                    {award.achieved && claimStatus === 'pending' && (
                      <div className="w-full py-3 bg-yellow-400 text-yellow-900 rounded-lg font-medium text-center">
                        Claim Pending - Under Review
                      </div>
                    )}
                    {award.achieved && claimStatus === 'approved' && (
                      <div className="w-full py-3 bg-green-400 text-green-900 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                        <FaCheckCircle />
                        Voucher Approved
                      </div>
                    )}
                    {award.achieved && claimStatus === 'rejected' && (
                      <button
                        onClick={() => handleClaimAward(award)}
                        className="w-full py-3 bg-red-400 text-red-900 rounded-lg font-medium hover:bg-red-300 transition-colors"
                      >
                        Claim Rejected - Resubmit
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim Confirmation Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎉 Claim Car Voucher
              </h3>
              
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-800 font-medium mb-2">Award:</p>
                <p className="text-xl font-bold text-yellow-800">{selectedAward?.title}</p>
                <p className="text-sm text-gray-700 mt-2">{selectedAward?.reward}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Your claim will be submitted to admin for review. Once approved, you will receive your car voucher number.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClaimModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClaim}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCar />
                      Submit Claim
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Claim Submitted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your car voucher claim has been submitted. Admin will review and approve your claim soon.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default AwardsPage;
