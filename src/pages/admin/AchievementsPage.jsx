import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI, userAPI } from '../../services/api';
import { FaAward, FaSearch, FaTrophy, FaCar } from 'react-icons/fa';

const AchievementsPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, binary, ceiling, car, royal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers ? await userAPI.getUsers() : await fetch(`${import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api'}/admin/users`).then(r => r.json());
      if (response.success) {
        const usersData = response.users || [];
        
        // Fetch achievements and progress for each user
        const usersWithAchievements = await Promise.all(
          usersData.map(async (user) => {
            try {
              const achievementsRes = await mlmAPI.getAchievements(user.username);
              const progressRes = await mlmAPI.getProgress(user.username);
              
              return {
                ...user,
                achievements: achievementsRes.success ? achievementsRes.achievements : [],
                progress: progressRes.success ? progressRes.progress : {}
              };
            } catch (error) {
              console.error(`Error fetching data for ${user.username}:`, error);
              return {
                ...user,
                achievements: [],
                progress: {}
              };
            }
          })
        );
        
        setUsers(usersWithAchievements);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load achievements data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    // Search filter
    const searchMatch = !searchTerm || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    if (filterType === 'all') return searchMatch;
    
    const hasAchievement = user.achievements.some(a => a.achievement_type === filterType);
    return searchMatch && hasAchievement;
  });

  const getAchievementStats = () => {
    const stats = {
      binary: 0,
      ceiling: 0,
      car: 0,
      royal: 0
    };
    
    users.forEach(user => {
      user.achievements.forEach(achievement => {
        if (stats[achievement.achievement_type] !== undefined) {
          stats[achievement.achievement_type]++;
        }
      });
    });
    
    return stats;
  };

  const stats = getAchievementStats();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAchievementBadge = (type) => {
    const badges = {
      binary: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Binary Achiever' },
      ceiling: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Ceiling Achiever' },
      car: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Car Achiever' },
      royal: { bg: 'bg-red-100', text: 'text-red-800', label: 'Royal Car' }
    };
    return badges[type] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
  };

  const calculateProgressPercentage = (progress, type) => {
    if (!progress) return 0;
    
    const requirements = {
      binary: { left: 50000, right: 50000 },
      ceiling: { left: 5, right: 5 },
      car: { left: 50, right: 50 },
      royal: { left: 100, right: 100 }
    };
    
    const req = requirements[type];
    if (!req) return 0;
    
    const leftProgress = Math.min((progress.left_volume || 0) / req.left * 100, 100);
    const rightProgress = Math.min((progress.right_volume || 0) / req.right * 100, 100);
    
    return Math.min(leftProgress, rightProgress);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaAward className="text-3xl text-yellow-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Achievements Dashboard</h1>
              <p className="text-gray-600 mt-1">Track user achievements and progress</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="text-blue-600" />
              <p className="text-blue-600 text-sm font-medium">Binary Achievers</p>
            </div>
            <p className="text-2xl font-bold text-blue-800">{stats.binary}</p>
            <p className="text-xs text-blue-600 mt-1">₹25k One-time</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="text-purple-600" />
              <p className="text-purple-600 text-sm font-medium">Ceiling Achievers</p>
            </div>
            <p className="text-2xl font-bold text-purple-800">{stats.ceiling}</p>
            <p className="text-xs text-purple-600 mt-1">₹11k/month × 12</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCar className="text-yellow-600" />
              <p className="text-yellow-600 text-sm font-medium">Car Achievers</p>
            </div>
            <p className="text-2xl font-bold text-yellow-800">{stats.car}</p>
            <p className="text-xs text-yellow-600 mt-1">₹15k/month × 12 + ₹5L</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCar className="text-red-600" />
              <p className="text-red-600 text-sm font-medium">Royal Car</p>
            </div>
            <p className="text-2xl font-bold text-red-800">{stats.royal}</p>
            <p className="text-xs text-red-600 mt-1">₹25k/month × 12 + ₹10L</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by username or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('binary')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'binary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Binary
              </button>
              <button
                onClick={() => setFilterType('ceiling')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'ceiling' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ceiling
              </button>
              <button
                onClick={() => setFilterType('car')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'car' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Car
              </button>
              <button
                onClick={() => setFilterType('royal')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'royal' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Royal
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Binary Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Achievement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const progress = user.progress || {};
                    const latestAchievement = user.achievements.length > 0 
                      ? user.achievements.sort((a, b) => new Date(b.achieved_at) - new Date(a.achieved_at))[0]
                      : null;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.achievements.length === 0 ? (
                              <span className="text-sm text-gray-400">No achievements yet</span>
                            ) : (
                              user.achievements.map((achievement, idx) => {
                                const badge = getAchievementBadge(achievement.achievement_type);
                                return (
                                  <span
                                    key={idx}
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}
                                  >
                                    {badge.label}
                                  </span>
                                );
                              })
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Left: ₹{parseFloat(progress.left_volume || 0).toLocaleString()}</span>
                                <span>{Math.min((progress.left_volume || 0) / 50000 * 100, 100).toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${Math.min((progress.left_volume || 0) / 50000 * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Right: ₹{parseFloat(progress.right_volume || 0).toLocaleString()}</span>
                                <span>{Math.min((progress.right_volume || 0) / 50000 * 100, 100).toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${Math.min((progress.right_volume || 0) / 50000 * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="text-gray-900">Left: {progress.left_count || 0}</p>
                            <p className="text-gray-900">Right: {progress.right_count || 0}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {latestAchievement ? (
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">
                                {getAchievementBadge(latestAchievement.achievement_type).label}
                              </p>
                              <p className="text-gray-500">{formatDate(latestAchievement.achieved_at)}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AchievementsPage;
