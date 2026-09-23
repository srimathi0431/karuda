import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', isAdminAuthenticated);
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [isAdminAuthenticated, adminUser]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders();
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when admin logs in
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchUsers();
      fetchOrders();
    }
  }, [isAdminAuthenticated]);

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.login(email, password);
      
      if (response.success) {
        setAdminUser(response.admin);
        setIsAdminAuthenticated(true);
        return { success: true, user: response.admin };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    setUsers([]);
    setOrders([]);
    localStorage.removeItem('adminUser');
    localStorage.setItem('isAdminAuthenticated', 'false');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const getDashboardStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.success) {
        return response.stats;
      }
      // Fallback to calculating from local data
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.order_status === 'Processing').length;
      const completedOrders = orders.filter(o => o.order_status === 'Delivered').length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
      
      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'Active').length,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalProducts: 16,
        totalPackages: 2,
      };
    } catch (err) {
      setError(err.message);
      // Return empty stats on error
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalPackages: 0,
      };
    }
  };

  const value = {
    isAdminAuthenticated,
    adminUser,
    adminLogin,
    adminLogout,
    users,
    orders,
    updateOrderStatus,
    updateUserStatus,
    getDashboardStats,
    fetchUsers,
    fetchOrders,
    loading,
    error,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
