import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserPanelContext = createContext();

export const useUserPanel = () => {
  const context = useContext(UserPanelContext);
  if (!context) throw new Error('useUserPanel must be used within UserPanelProvider');
  return context;
};

export const UserPanelProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Get user ID (in real app, this comes from backend)
  const getUserId = () => {
    if (!user) return null;
    // Generate consistent ID from email
    return user.email ? parseInt(user.email.split('@')[0].replace(/\D/g, '') || '1') : 1;
  };

  const currentUserId = getUserId();

  // Mock referral data - in production, fetch from backend based on logged-in user
  const [referrals, setReferrals] = useState(() => {
    const saved = localStorage.getItem(`user_referrals_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    // Generate mock referrals for current user
    return Array.from({ length: 23 }, (_, i) => ({
      id: 100 + i,
      userId: `REF${1000 + i}`,
      name: `Referral User ${i + 1}`,
      email: `referral${i + 1}@example.com`,
      mobile: `+91 ${9000000000 + i}`,
      joiningDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: i % 7 === 0 ? 'Inactive' : 'Active',
      level: Math.floor(Math.random() * 3) + 1,
    }));
  });

  // Mock team data
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem(`user_team_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    return Array.from({ length: 31 }, (_, i) => ({
      id: 200 + i,
      memberId: `MEM${2000 + i}`,
      name: `Team Member ${i + 1}`,
      email: `member${i + 1}@example.com`,
      mobile: `+91 ${9100000000 + i}`,
      level: Math.floor(Math.random() * 5) + 1,
      joiningDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: i % 8 === 0 ? 'Inactive' : 'Active',
      totalSales: Math.floor(Math.random() * 50000) + 5000,
    }));
  });

  // Mock matching bonus data
  const [matchingBonus, setMatchingBonus] = useState(() => {
    const saved = localStorage.getItem(`user_matching_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    const statuses = ['Credited', 'Pending', 'Processing'];
    return Array.from({ length: 27 }, (_, i) => ({
      id: 300 + i,
      transactionId: `MTB${3000 + i}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      leftPoints: Math.floor(Math.random() * 1000) + 100,
      rightPoints: Math.floor(Math.random() * 1000) + 100,
      matchingPairs: Math.floor(Math.random() * 10) + 1,
      bonusAmount: Math.floor(Math.random() * 5000) + 500,
      status: statuses[i % statuses.length],
    }));
  });

  // Mock rewards data
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem(`user_rewards_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    const rewardTypes = ['Referral Reward', 'Purchase Bonus', 'Loyalty Reward', 'Achievement Bonus'];
    const statuses = ['Received', 'Pending', 'Processing'];
    
    return Array.from({ length: 19 }, (_, i) => ({
      id: 400 + i,
      rewardId: `RWD${4000 + i}`,
      rewardName: rewardTypes[i % rewardTypes.length],
      achievement: `Milestone ${i + 1}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      amount: Math.floor(Math.random() * 3000) + 300,
      status: statuses[i % statuses.length],
      details: 'Reward for achieving milestone',
    }));
  });

  // Mock transactions data
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`user_transactions_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    const types = ['Credit', 'Debit', 'Refund', 'Bonus', 'Withdrawal'];
    const statuses = ['Completed', 'Pending', 'Failed'];
    
    return Array.from({ length: 42 }, (_, i) => ({
      id: 500 + i,
      transactionId: `TXN${5000 + i}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      type: types[i % types.length],
      amount: Math.floor(Math.random() * 10000) + 100,
      status: statuses[i % statuses.length],
      description: `Transaction for ${types[i % types.length]}`,
    }));
  });

  // Mock P2P data
  const [p2pRecords, setP2pRecords] = useState(() => {
    const saved = localStorage.getItem(`user_p2p_${currentUserId}`);
    if (saved) return JSON.parse(saved);
    
    const types = ['Sent', 'Received', 'Requested'];
    const statuses = ['Completed', 'Pending', 'Cancelled'];
    
    return Array.from({ length: 18 }, (_, i) => ({
      id: 600 + i,
      p2pId: `P2P${6000 + i}`,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      type: types[i % types.length],
      counterparty: `User ${i + 10}`,
      amount: Math.floor(Math.random() * 5000) + 500,
      status: statuses[i % statuses.length],
      notes: 'P2P transfer',
    }));
  });

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem(`user_wallet_${currentUserId}`);
    return saved ? parseFloat(saved) : 15500.0;
  });

  // Persist data
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_referrals_${currentUserId}`, JSON.stringify(referrals));
    }
  }, [referrals, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_team_${currentUserId}`, JSON.stringify(team));
    }
  }, [team, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_matching_${currentUserId}`, JSON.stringify(matchingBonus));
    }
  }, [matchingBonus, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_rewards_${currentUserId}`, JSON.stringify(rewards));
    }
  }, [rewards, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_transactions_${currentUserId}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_p2p_${currentUserId}`, JSON.stringify(p2pRecords));
    }
  }, [p2pRecords, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`user_wallet_${currentUserId}`, walletBalance.toString());
    }
  }, [walletBalance, currentUserId]);

  // Dashboard stats
  const getDashboardStats = () => {
    const activeReferrals = referrals.filter(r => r.status === 'Active').length;
    const activeTeam = team.filter(t => t.status === 'Active').length;
    const totalBonus = matchingBonus
      .filter(m => m.status === 'Credited')
      .reduce((sum, m) => sum + m.bonusAmount, 0);
    const totalRewards = rewards
      .filter(r => r.status === 'Received')
      .reduce((sum, r) => sum + r.amount, 0);
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('karuda_orders') || '[]');
    
    return {
      totalReferrals: referrals.length,
      activeReferrals,
      totalTeam: team.length,
      activeTeam,
      totalMatchingBonus: totalBonus,
      totalRewards,
      totalOrders: orders.length,
      walletBalance,
      pendingBonus: matchingBonus.filter(m => m.status === 'Pending').length,
      pendingTransactions: transactions.filter(t => t.status === 'Pending').length,
    };
  };

  const value = {
    referrals,
    team,
    matchingBonus,
    rewards,
    transactions,
    p2pRecords,
    walletBalance,
    setWalletBalance,
    getDashboardStats,
    currentUserId,
  };

  return <UserPanelContext.Provider value={value}>{children}</UserPanelContext.Provider>;
};
