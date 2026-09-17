import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

// Admin credentials
const ADMIN_EMAIL = 'karuda@gmail.com';
const ADMIN_PASSWORD = '12345678';

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Mock users data (in real app, this would come from database/API)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('admin_users');
    if (saved) return JSON.parse(saved);
    
    // Default mock data
    return Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+91 ${9000000000 + i}`,
      status: i % 5 === 0 ? 'Inactive' : 'Active',
      registeredDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    }));
  });

  // Mock orders data
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('admin_orders');
    if (saved) return JSON.parse(saved);

    // Get from ShopContext orders or create mock data
    const shopOrders = localStorage.getItem('karuda_orders');
    if (shopOrders) {
      const parsedOrders = JSON.parse(shopOrders);
      if (parsedOrders.length > 0) return parsedOrders;
    }

    // Default mock data
    const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentStatuses = ['Paid', 'Pending', 'Failed'];
    const products = ['Saree', 'Induction Stove', 'Santhana Kinnam', 'Maligai Porulgal', '₹6,000 Package'];
    
    return Array.from({ length: 38 }, (_, i) => ({
      id: 1000 + i,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      product: products[i % products.length],
      quantity: Math.floor(Math.random() * 3) + 1,
      amount: Math.floor(Math.random() * 10000) + 1000,
      orderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
      orderStatus: statuses[i % statuses.length],
    }));
  });

  // Mock product tracking data
  const [productTracking, setProductTracking] = useState(() => {
    const saved = localStorage.getItem('admin_tracking');
    if (saved) return JSON.parse(saved);

    const statuses = ['In Progress', 'Completed', 'Pending', 'Cancelled'];
    const products = ['Saree', 'Induction Stove', 'Santhana Kinnam', 'Maligai Porulgal'];
    
    return Array.from({ length: 32 }, (_, i) => ({
      id: 5000 + i,
      trackingId: `TRK${10000 + i}`,
      product: products[i % products.length],
      customerName: `Customer ${i + 1}`,
      orderId: 1000 + i,
      matchingStatus: statuses[i % statuses.length],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      currentStatus: statuses[i % statuses.length],
    }));
  });

  // Mock bonus/referral data
  const [bonusTracking, setBonusTracking] = useState(() => {
    const saved = localStorage.getItem('admin_bonus');
    if (saved) return JSON.parse(saved);

    const types = ['Referral Bonus', 'Purchase Bonus', 'Loyalty Bonus', 'Sign-up Bonus'];
    const statuses = ['Credited', 'Pending', 'Processing'];
    
    return Array.from({ length: 28 }, (_, i) => ({
      id: 7000 + i,
      userId: i + 1,
      userName: `User ${i + 1}`,
      bonusType: types[i % types.length],
      amount: Math.floor(Math.random() * 500) + 50,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: statuses[i % statuses.length],
      referredUser: i % 3 === 0 ? `User ${i + 10}` : null,
    }));
  });

  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', isAdminAuthenticated);
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [isAdminAuthenticated, adminUser]);

  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('admin_tracking', JSON.stringify(productTracking));
  }, [productTracking]);

  useEffect(() => {
    localStorage.setItem('admin_bonus', JSON.stringify(bonusTracking));
  }, [bonusTracking]);

  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = {
        id: 1,
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin',
      };
      setAdminUser(admin);
      setIsAdminAuthenticated(true);
      return { success: true, user: admin };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminUser');
    localStorage.setItem('isAdminAuthenticated', 'false');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const getDashboardStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'Active').length,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalProducts: 16, // From products.js
      totalPackages: 2, // From packages.js
    };
  };

  const value = {
    isAdminAuthenticated,
    adminUser,
    adminLogin,
    adminLogout,
    users,
    orders,
    productTracking,
    bonusTracking,
    updateOrderStatus,
    updateUserStatus,
    getDashboardStats,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
