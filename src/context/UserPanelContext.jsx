import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const UserPanelContext = createContext();

export const useUserPanel = () => {
  const context = useContext(UserPanelContext);
  if (!context) throw new Error('useUserPanel must be used within UserPanelProvider');
  return context;
};

export const UserPanelProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const currentUsername = user?.username;

  const [referrals, setReferrals] = useState([]);
  const [team, setTeam] = useState([]);
  const [matchingBonus, setMatchingBonus] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [p2pRecords, setP2pRecords] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [binaryTree, setBinaryTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from API
  const fetchReferrals = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getReferrals(currentUsername);
      if (response.success) {
        setReferrals(response.referrals || []);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
  };

  const fetchTeam = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getTeam(currentUsername);
      if (response.success) {
        setTeam(response.team || []);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const fetchMatchingBonus = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getMatchingBonus(currentUsername);
      if (response.success) {
        setMatchingBonus(response.matching_bonus || []);
      }
    } catch (err) {
      console.error('Error fetching matching bonus:', err);
    }
  };

  const fetchRewards = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getRewards(currentUsername);
      if (response.success) {
        setRewards(response.rewards || []);
      }
    } catch (err) {
      console.error('Error fetching rewards:', err);
    }
  };

  const fetchTransactions = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getTransactions(currentUsername);
      if (response.success) {
        setTransactions(response.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchP2P = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getP2P(currentUsername);
      if (response.success) {
        setP2pRecords(response.p2p_transfers || []);
      }
    } catch (err) {
      console.error('Error fetching P2P:', err);
    }
  };

  const fetchWalletBalance = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getWallet(currentUsername);
      if (response.success) {
        setWalletBalance(response.wallet_balance || 0);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  };

  const fetchBinaryTree = async () => {
    if (!currentUsername) return;
    try {
      const response = await userAPI.getBinaryTree(currentUsername);
      if (response.success) {
        setBinaryTree(response.tree);
      }
    } catch (err) {
      console.error('Error fetching binary tree:', err);
    }
  };

  // Fetch all data when user logs in
  const fetchAllData = async () => {
    if (!currentUsername || !isAuthenticated) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchReferrals(),
        fetchTeam(),
        fetchMatchingBonus(),
        fetchRewards(),
        fetchTransactions(),
        fetchP2P(),
        fetchWalletBalance(),
        fetchBinaryTree(),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user logs in
  useEffect(() => {
    if (isAuthenticated && currentUsername) {
      fetchAllData();
    } else {
      // Clear data on logout
      setReferrals([]);
      setTeam([]);
      setMatchingBonus([]);
      setRewards([]);
      setTransactions([]);
      setP2pRecords([]);
      setWalletBalance(0);
      setBinaryTree(null);
    }
  }, [isAuthenticated, currentUsername]);

  // Dashboard stats
  const getDashboardStats = () => {
    const activeReferrals = referrals.filter(r => r.status === 'Active').length;
    const activeTeam = team.filter(t => t.status === 'Active').length;
    const totalBonus = matchingBonus
      .filter(m => m.status === 'Credited')
      .reduce((sum, m) => sum + (m.bonus_amount || 0), 0);
    const totalRewards = rewards
      .filter(r => r.status === 'Received')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    return {
      totalReferrals: referrals.length,
      activeReferrals,
      totalTeam: team.length,
      activeTeam,
      totalMatchingBonus: totalBonus,
      totalRewards,
      totalOrders: 0, // Will be fetched from orders API
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
    binaryTree,
    setWalletBalance,
    getDashboardStats,
    currentUsername,
    fetchAllData,
    fetchReferrals,
    fetchTeam,
    fetchMatchingBonus,
    fetchRewards,
    fetchTransactions,
    fetchP2P,
    fetchWalletBalance,
    loading,
    error,
  };

  return <UserPanelContext.Provider value={value}>{children}</UserPanelContext.Provider>;
};
