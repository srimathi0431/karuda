import React, { useState } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import UserPagination from '../../components/user/UserPagination';
import { FaSearch, FaGift } from 'react-icons/fa';

const UserRewards = () => {
  const { rewards = [], loading } = useUserPanel() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredRewards = rewards.filter(
    (reward) =>
      (reward.reward_type || reward.rewardName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reward.description || reward.achievement || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRewards.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRewards = filteredRewards.slice(startIndex, startIndex + rowsPerPage);

  const totalRewards = rewards.reduce((sum, r) => sum + (r.amount || 0), 0);
  const rewardTypes = [...new Set(rewards.map(r => r.reward_type || r.rewardName))];

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800">Loading rewards...</h1>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaGift className="text-3xl text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Rewards & Records</h1>
              <p className="text-gray-600 mt-1">View all your earned rewards and achievements</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Rewards</p>
            <p className="text-3xl font-bold text-pink-500">
              ₹{totalRewards.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Records</p>
            <p className="text-3xl font-bold text-blue-500">{rewards.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Reward Types</p>
            <p className="text-3xl font-bold text-purple-500">{rewardTypes.length}</p>
          </div>
        </div>

        {/* Reward Types Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Reward Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewardTypes.map((type) => {
              const typeRewards = rewards.filter(r => (r.reward_type || r.rewardName) === type);
              const typeTotal = typeRewards.reduce((sum, r) => sum + (r.amount || 0), 0);
              return (
                <div key={type} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">{type}</p>
                  <p className="text-xl font-bold text-gray-800">
                    ₹{typeTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {typeRewards.length} transaction{typeRewards.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by type or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reward ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRewards.length > 0 ? (
                  currentRewards.map((reward) => (
                    <tr key={reward.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reward.reward_id || reward.rewardId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {reward.reward_type || reward.rewardName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reward.description || reward.achievement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ₹{(reward.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(reward.reward_date || reward.date || reward.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reward.status === 'Received' || reward.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : reward.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {reward.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No rewards found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </UserPanelLayout>
  );
};

export default UserRewards;
