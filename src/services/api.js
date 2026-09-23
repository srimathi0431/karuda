import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth token (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ==================== ADMIN API ====================

export const adminAPI = {
  // Admin login
  login: async (email, password) => {
    return api.post('/admin/login', { email, password });
  },

  // Get all users
  getUsers: async () => {
    return api.get('/admin/users');
  },

  // Get all orders
  getOrders: async () => {
    return api.get('/admin/orders');
  },

  // Get dashboard stats
  getStats: async () => {
    return api.get('/admin/stats');
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    return api.put(`/admin/users/${userId}/status`, { status });
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    return api.put(`/admin/orders/${orderId}/status`, { status });
  },

  // ========== USER DETAIL ENDPOINTS ==========
  
  // Get complete user details
  getUserDetails: async (username) => {
    return api.get(`/admin/user-details/${username}`);
  },

  // Get user login history
  getUserLogins: async (username, limit = 3) => {
    return api.get(`/admin/user-logins/${username}?limit=${limit}`);
  },

  // Get user team summary
  getUserTeam: async (username) => {
    return api.get(`/admin/user-team/${username}`);
  },

  // Credit wallet (admin)
  creditWallet: async (username, walletType, amount, reason, adminEmail) => {
    return api.post('/admin/wallet/credit', {
      username,
      wallet_type: walletType,
      amount,
      reason,
      admin_email: adminEmail
    });
  },

  // Debit wallet (admin)
  debitWallet: async (username, walletType, amount, reason, adminEmail) => {
    return api.post('/admin/wallet/debit', {
      username,
      wallet_type: walletType,
      amount,
      reason,
      admin_email: adminEmail
    });
  },
};

// ==================== USER API ====================

export const userAPI = {
  // User registration
  register: async (userData) => {
    return api.post('/user/register', userData);
  },

  // User login
  login: async (email, password) => {
    return api.post('/user/login', { email, password });
  },

  // Get user profile
  getProfile: async (username) => {
    return api.get(`/user/${username}`);
  },

  // Get user referrals
  getReferrals: async (username) => {
    return api.get(`/user/${username}/referrals`);
  },

  // Get user team
  getTeam: async (username) => {
    return api.get(`/user/${username}/team`);
  },

  // Get binary tree info
  getBinaryTree: async (username) => {
    return api.get(`/user/${username}/binary-tree`);
  },

  // Get user orders
  getOrders: async (username) => {
    return api.get(`/user/${username}/orders`);
  },

  // Get user transactions
  getTransactions: async (username) => {
    return api.get(`/user/${username}/transactions`);
  },

  // Get matching bonus
  getMatchingBonus: async (username) => {
    return api.get(`/user/${username}/matching-bonus`);
  },

  // Get rewards
  getRewards: async (username) => {
    return api.get(`/user/${username}/rewards`);
  },

  // Get P2P transfers
  getP2P: async (username) => {
    return api.get(`/user/${username}/p2p`);
  },

  // Get wallet balance
  getWallet: async (username) => {
    return api.get(`/user/${username}/wallet`);
  },

  // Update user profile
  updateProfile: async (username, profileData) => {
    return api.put(`/user/${username}/profile`, profileData);
  },

  // Change password
  changePassword: async (username, oldPassword, newPassword) => {
    return api.post(`/user/${username}/change-password`, {
      old_password: oldPassword,
      new_password: newPassword
    });
  },
};

// ==================== REFERRAL API ====================

export const referralAPI = {
  // Validate referrer
  validate: async (username) => {
    return api.get(`/referral/validate/${username}`);
  },

  // Check position availability
  checkPosition: async (username, position) => {
    return api.get(`/referral/${username}/check-position/${position}`);
  },

  // Get referral links with stats
  getLinks: async (username) => {
    return api.get(`/user/${username}/referral-links`);
  },

  // Track referral click
  trackClick: async (referrerUsername, position, metadata = {}) => {
    return api.post('/referral/track-click', {
      referrer_username: referrerUsername,
      position,
      ip_address: metadata.ip_address,
      user_agent: navigator.userAgent,
      device_type: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      ...metadata
    });
  },

  // Get tree strength
  getTreeStrength: async (username) => {
    return api.get(`/user/${username}/tree-strength`);
  },

  // Get user achievements
  getAchievements: async (username) => {
    return api.get(`/user/${username}/achievements`);
  },

  // Log share activity
  logShare: async (username, shareMethod, position, metadata = {}) => {
    return api.post(`/user/${username}/share`, {
      share_method: shareMethod,
      position,
      ...metadata
    });
  },

  // Get share stats
  getShareStats: async (username) => {
    return api.get(`/user/${username}/share-stats`);
  },
};

// ==================== ORDER API ====================

export const orderAPI = {
  // Create order
  create: async (orderData) => {
    return api.post('/orders', orderData);
  },
};

// ==================== TRANSACTION API ====================

export const transactionAPI = {
  // Create transaction
  create: async (transactionData) => {
    return api.post('/transactions', transactionData);
  },
};

// ==================== P2P API ====================

export const p2pAPI = {
  // Create P2P transfer
  transfer: async (transferData) => {
    return api.post('/p2p/transfer', transferData);
  },
};

// ==================== PACKAGE API ====================

export const packageAPI = {
  // Create package deposit
  createDeposit: async (depositData) => {
    return api.post('/packages/deposit', depositData);
  },

  // Get user's package
  getUserPackage: async (username) => {
    return api.get(`/packages/user/${username}`);
  },

  // Admin: Get all packages
  getAllPackages: async (status = null, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return api.get(`/packages/admin?${params.toString()}`);
  },

  // Admin: Approve package
  approvePackage: async (packageId, adminEmail, adminNotes = '') => {
    return api.put(`/packages/${packageId}/approve`, {
      admin_email: adminEmail,
      admin_notes: adminNotes
    });
  },

  // Admin: Reject package
  rejectPackage: async (packageId, adminEmail, adminNotes) => {
    return api.put(`/packages/${packageId}/reject`, {
      admin_email: adminEmail,
      admin_notes: adminNotes
    });
  },
};

// ==================== PRODUCT API ====================

export const productAPI = {
  // Get all products
  getAll: async (availableOnly = true) => {
    return api.get(`/products?available_only=${availableOnly}`);
  },

  // Admin: Upload product image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload image');
    }
    
    return response.json();
  },

  // Admin: Create product
  create: async (productData) => {
    return api.post('/products', productData);
  },

  // Admin: Update product
  update: async (productId, productData) => {
    return api.put(`/products/${productId}`, productData);
  },

  // Admin: Delete product
  delete: async (productId) => {
    return api.delete(`/products/${productId}`);
  },
};

// ==================== PACKAGE ORDER API ====================

export const packageOrderAPI = {
  // Create package order
  create: async (orderData) => {
    return api.post('/package-orders', orderData);
  },

  // Get user's package orders
  getUserOrders: async (username) => {
    return api.get(`/package-orders/user/${username}`);
  },

  // Admin: Get all package orders
  getAllOrders: async (limit = 20, offset = 0) => {
    return api.get(`/package-orders/admin?limit=${limit}&offset=${offset}`);
  },

  // Admin: Update order status
  updateStatus: async (orderId, status) => {
    return api.put(`/package-orders/${orderId}/status`, { status });
  },
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
  check: async () => {
    return api.get('/health');
  },
};

// Export default api instance for custom calls
export default api;


// ==================== PAYMENT SETTINGS API ====================

export const paymentSettingsAPI = {
  // Get payment settings (public)
  getSettings: async () => {
    return api.get('/payment-settings');
  },

  // Admin: Get payment settings
  getAdminSettings: async () => {
    return api.get('/admin/payment-settings');
  },

  // Admin: Update payment settings
  updateSettings: async (settingsData) => {
    return api.put('/admin/payment-settings', settingsData);
  },

  // Admin: Upload QR code
  uploadQR: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/admin/upload-qr`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload QR code');
    }
    
    return response.json();
  },

  // Get user deposit history
  getDepositHistory: async (username, limit = 10, offset = 0) => {
    return api.get(`/user/${username}/deposit-history?limit=${limit}&offset=${offset}`);
  }
};


// ==================== MLM WALLET SYSTEM API ====================

export const mlmAPI = {
  // ========== WALLET ENDPOINTS ==========
  
  // Get user's both wallets
  getWallets: async (username) => {
    return api.get(`/wallet/${username}`);
  },

  // Get wallet transactions
  getTransactions: async (username, walletType = null, limit = 50) => {
    const params = new URLSearchParams();
    if (walletType) params.append('wallet_type', walletType);
    params.append('limit', limit.toString());
    return api.get(`/wallet/${username}/transactions?${params.toString()}`);
  },

  // ========== DIRECT BONUS ENDPOINTS ==========
  
  // Get direct bonus history
  getDirectBonuses: async (username) => {
    return api.get(`/bonus/direct/${username}`);
  },

  // Get direct bonus status (cap tracking)
  getDirectBonusStatus: async (username) => {
    return api.get(`/bonus/direct/${username}/status`);
  },

  // ========== MATCHING BONUS ENDPOINTS ==========
  
  // Get matching bonus history
  getMatchingHistory: async (username, limit = 50) => {
    return api.get(`/bonus/matching/${username}?limit=${limit}`);
  },

  // Get current binary legs status
  getBinaryLegs: async (username) => {
    return api.get(`/bonus/matching/${username}/current`);
  },

  // ========== BUSINESS VOLUME ENDPOINTS ==========
  
  // Get business volume
  getVolume: async (username) => {
    return api.get(`/volume/${username}`);
  },

  // ========== ACHIEVEMENTS ENDPOINTS ==========
  
  // Get all achievements
  getAchievements: async (username) => {
    return api.get(`/achievements/${username}`);
  },

  // Get achievement progress
  getProgress: async (username) => {
    return api.get(`/achievements/${username}/progress`);
  },

  // ========== AWARD CLAIMS ENDPOINTS ==========
  
  // User: Claim car voucher
  claimAward: async (claimData) => {
    return api.post('/achievements/claim', claimData);
  },

  // Admin: Get all award claims
  getAllClaims: async (statusFilter = null) => {
    const params = statusFilter ? `?status_filter=${statusFilter}` : '';
    return api.get(`/admin/achievements/claims${params}`);
  },

  // User: Get user's award claims
  getUserClaims: async (username) => {
    return api.get(`/achievements/claims/${username}`);
  },

  // Admin: Approve award claim
  approveClaim: async (claimId, adminEmail, voucherNumber, adminNotes = '') => {
    return api.put(`/admin/achievements/claims/${claimId}/approve`, {
      admin_email: adminEmail,
      voucher_number: voucherNumber,
      admin_notes: adminNotes
    });
  },

  // Admin: Reject award claim
  rejectClaim: async (claimId, adminEmail, adminNotes) => {
    return api.put(`/admin/achievements/claims/${claimId}/reject`, {
      admin_email: adminEmail,
      admin_notes: adminNotes
    });
  },

  // ========== MONTHLY PAYOUTS ENDPOINTS ==========
  
  // Get payout schedule
  getPayoutSchedule: async (username) => {
    return api.get(`/payouts/${username}`);
  },

  // Admin: Process monthly payouts manually
  processPayouts: async () => {
    return api.post('/admin/payouts/process');
  },

  // ========== WITHDRAWAL ENDPOINTS ==========
  
  // Get withdrawal settings (public)
  getWithdrawalSettings: async () => {
    return api.get('/withdrawal/settings');
  },

  // Admin: Update withdrawal settings
  updateWithdrawalSettings: async (settingsData) => {
    return api.put('/admin/withdrawal/settings', settingsData);
  },

  // User: Create withdrawal request
  createWithdrawal: async (withdrawalData) => {
    return api.post('/withdrawal/request', withdrawalData);
  },

  // User: Get user's withdrawal requests
  getUserWithdrawals: async (username) => {
    return api.get(`/withdrawal/${username}`);
  },

  // Admin: Get all withdrawal requests
  getAllWithdrawals: async (statusFilter = null, limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (statusFilter) params.append('status_filter', statusFilter);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return api.get(`/admin/withdrawal/requests?${params.toString()}`);
  },

  // Admin: Approve withdrawal
  approveWithdrawal: async (requestId, adminEmail, adminNotes = '') => {
    return api.put(`/admin/withdrawal/${requestId}/approve`, {
      admin_email: adminEmail,
      admin_notes: adminNotes
    });
  },

  // Admin: Reject withdrawal
  rejectWithdrawal: async (requestId, adminEmail, adminNotes) => {
    return api.put(`/admin/withdrawal/${requestId}/reject`, {
      admin_email: adminEmail,
      admin_notes: adminNotes
    });
  },

  // ========== MLM DASHBOARD STATS ==========
  
  // Admin: Get MLM dashboard statistics
  getMLMStats: async () => {
    return api.get('/admin/mlm/stats');
  },
};
