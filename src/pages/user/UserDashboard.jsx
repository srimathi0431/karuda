import React from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import { FaUsers, FaGift, FaDollarSign, FaShoppingCart } from 'react-icons/fa';

const UserDashboard = () => {
  const { referrals = [], team = [], matchingBonus = [], rewards = [], transactions = [], p2pRecords = [] } = useUserPanel() || {};

  // Get orders from localStorage since they're not in context
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  const stats = [
    {
      title: 'Total Referrals',
      value: referrals.length,
      icon: <FaUsers className="text-pink-500" />,
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Team Members',
      value: team.length,
      icon: <FaUsers className="text-blue-500" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Rewards',
      value: `₹${rewards.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      icon: <FaGift className="text-green-500" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Matching Bonus',
      value: `₹${matchingBonus.reduce((sum, b) => sum + b.bonusAmount, 0).toLocaleString()}`,
      icon: <FaDollarSign className="text-yellow-500" />,
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <FaShoppingCart className="text-purple-500" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Transactions',
      value: transactions.length,
      icon: <FaDollarSign className="text-indigo-500" />,
      bgColor: 'bg-indigo-50',
    },
  ];

  const recentActivities = [
    ...referrals.slice(0, 3).map(r => ({
      type: 'referral',
      message: `${r.name} joined through your referral`,
      date: r.joiningDate,
    })),
    ...rewards.slice(0, 2).map(r => ({
      type: 'reward',
      message: `Received ₹${r.amount} ${r.rewardName}`,
      date: r.date,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-pink-100">Here's your dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-full text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`mt-1 ${
                    activity.type === 'referral' ? 'text-blue-500' : 'text-green-500'
                  }`}>
                    {activity.type === 'referral' ? <FaUsers /> : <FaGift />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserDashboard;
