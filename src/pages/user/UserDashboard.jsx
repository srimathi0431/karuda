import React, { useEffect, useState } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useUserPanel } from '../../context/UserPanelContext';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { FaUsers, FaGift, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const { referrals = [], team = [], matchingBonus = [], rewards = [], transactions = [], p2pRecords = [], loading } = useUserPanel() || {};
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.username) return;
      
      try {
        setLoadingOrders(true);
        const response = await userAPI.getOrders(user.username);
        if (response.success) {
          setOrders(response.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user?.username]);

  const stats = [
    {
      title: 'Total Referrals',
      value: referrals.length,
      icon: <FaUsers />,
      iconClass: 'pink',
    },
    {
      title: 'Team Members',
      value: team.length,
      icon: <FaUsers />,
      iconClass: 'blue',
    },
    {
      title: 'Total Rewards',
      value: `₹${rewards.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      icon: <FaGift />,
      iconClass: 'green',
    },
    {
      title: 'Matching Bonus',
      value: `₹${matchingBonus.reduce((sum, b) => sum + b.bonusAmount, 0).toLocaleString()}`,
      icon: <FaDollarSign />,
      iconClass: 'yellow',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <FaShoppingCart />,
      iconClass: 'purple',
    },
    {
      title: 'Total Transactions',
      value: transactions.length,
      icon: <FaDollarSign />,
      iconClass: 'indigo',
    },
  ];

  const recentActivities = [
    ...referrals.slice(0, 3).map(r => ({
      type: 'referral',
      message: `${r.name} joined through your referral`,
      date: r.joining_date || r.created_at,
    })),
    ...rewards.slice(0, 2).map(r => ({
      type: 'reward',
      message: `Received ₹${r.amount} ${r.reward_type || 'reward'}`,
      date: r.reward_date || r.created_at,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  if (loading || loadingOrders) {
    return (
      <UserPanelLayout>
        <div className="user-dashboard">
          <div className="welcome-section">
            <h1>Loading...</h1>
            <p>Please wait while we fetch your data</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="user-dashboard">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome Back, {user?.name || user?.username}!</h1>
          <p>Here's your dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-content">
                <div className="stat-info">
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                </div>
                <div className={`stat-icon ${stat.iconClass}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="activities-section">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type === 'referral' ? 'blue' : 'green'}`}>
                    {activity.type === 'referral' ? <FaUsers /> : <FaGift />}
                  </div>
                  <div className="activity-details">
                    <p>{activity.message}</p>
                    <span>{activity.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activities">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserDashboard;
