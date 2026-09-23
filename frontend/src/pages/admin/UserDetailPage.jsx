import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendar, FaArrowLeft, 
  FaWallet, FaMoneyBillWave, FaUsers, FaChartLine, FaClock,
  FaTrophy, FaHistory, FaEye, FaEyeSlash, FaPlus, FaMinus,
  FaCheckCircle, FaExclamationTriangle, FaBox
} from 'react-icons/fa';

const UserDetailPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Modal states
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Wallet adjustment states
  const [walletAction, setWalletAction] = useState(null); // 'credit' or 'debit'
  const [selectedWallet, setSelectedWallet] = useState(null); // 'karudaa' or 'income'
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [username]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch user details
      const detailsRes = await adminAPI.getUserDetails(username);
      if (detailsRes.success) {
        setUserDetails(detailsRes.user_details);
      }

      // Fetch login history
      const loginsRes = await adminAPI.getUserLogins(username, 3);
      if (loginsRes.success) {
        setLoginHistory(loginsRes.login_history || []);
      }

      // Fetch team data
      const teamRes = await adminAPI.getUserTeam(username);
      if (teamRes.success) {
        setTeamData(teamRes.team);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletAdjustment = (action, walletType) => {
    setWalletAction(action);
    setSelectedWallet(walletType);
    setAdjustAmount('');
    setAdjustReason('');
    setShowWalletModal(true);
  };

  const handleWalletSubmit = () => {
    if (!adjustAmount || parseFloat(adjustAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!adjustReason.trim()) {
      alert('Please enter a reason');
      return;
    }
    
    setShowWalletModal(false);
    setShowConfirmModal(true);
  };

  const confirmWalletAdjustment = async () => {
    try {
      setProcessing(true);
      
      const amount = parseFloat(adjustAmount);
      const adminEmail = 'admin@karuda.shop'; // Get from auth context in real app

      let result;
      if (walletAction === 'credit') {
        result = await adminAPI.creditWallet(username, selectedWallet, amount, adjustReason, adminEmail);
      } else {
        result = await adminAPI.debitWallet(username, selectedWallet, amount, adjustReason, adminEmail);
      }

      if (result.success) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        
        // Refresh data
        fetchAllData();
      } else {
        alert(result.message || 'Failed to adjust wallet');
      }
    } catch (error) {
      console.error('Error adjusting wallet:', error);
      alert(error.message || 'Failed to adjust wallet');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!userDetails) {
    return (
      <AdminLayout>
        <div className="p-6">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft /> Back to Users
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">User not found</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { user_info, package_info, team_stats, direct_referrals, total_team_size, earnings, bonus_status } = userDetails;

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft /> Back to Users
          </button>
          <h1 className="text-2xl font-bold text-gray-800">User Details: @{username}</h1>
        </div>

        {/* Section 1: User Profile Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {user_info.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user_info.name || 'Unknown'}</h2>
                <p className="text-lg opacity-90">@{user_info.username}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaEnvelope /> {user_info.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaPhone /> {user_info.mobile || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendar />
                <span>Registered: {formatDate(user_info.created_at)}</span>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                user_info.status === 'Active' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
              }`}>
                {user_info.status || 'Unknown'}
              </div>
            </div>
          </div>
          
          {/* Password Display */}
          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">Password:</span>
              <span className="font-mono">
                {showPassword ? user_info.password || '********' : '••••••••'}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-white hover:text-gray-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Wallet Balances with Admin Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Karudaa Wallet */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaWallet className="text-2xl text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">Karudaa Wallet</h3>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-4">
              {formatCurrency(user_info.karudaa_wallet)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleWalletAdjustment('credit', 'karudaa')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus /> Add
              </button>
              <button
                onClick={() => handleWalletAdjustment('debit', 'karudaa')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaMinus /> Reduce
              </button>
            </div>
          </div>

          {/* Income Wallet */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-2xl text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Income Wallet</h3>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-4">
              {formatCurrency(user_info.income_wallet)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleWalletAdjustment('credit', 'income')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus /> Add
              </button>
              <button
                onClick={() => handleWalletAdjustment('debit', 'income')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaMinus /> Reduce
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Package Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaBox className="text-2xl text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Package Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total Packages</p>
              <p className="text-2xl font-bold text-blue-800">{package_info.package_count || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-800">{package_info.approved_count || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Last Purchase</p>
              <p className="text-sm font-bold text-purple-800">
                {package_info.last_package_date ? formatDate(package_info.last_package_date) : 'Never'}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-yellow-800">
                {formatCurrency((package_info.package_count || 0) * 6000)}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Team Structure */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="text-2xl text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Team Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Direct Referrals</p>
              <p className="text-2xl font-bold text-purple-800">{direct_referrals || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Left Leg</p>
              <p className="text-2xl font-bold text-blue-800">{team_stats?.left_active_users || 0}</p>
              <p className="text-xs text-blue-600">{formatCurrency(team_stats?.left_business_volume || 0)} volume</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Right Leg</p>
              <p className="text-2xl font-bold text-green-800">{team_stats?.right_active_users || 0}</p>
              <p className="text-xs text-green-600">{formatCurrency(team_stats?.right_business_volume || 0)} volume</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Total Team</p>
              <p className="text-2xl font-bold text-orange-800">{total_team_size || 0}</p>
            </div>
          </div>
        </div>

        {/* Section 5: Login History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-2xl text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Recent Login Activity</h3>
          </div>
          {loginHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No login history available</p>
          ) : (
            <div className="space-y-3">
              {loginHistory.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{formatDate(login.login_time)}</p>
                    <p className="text-sm text-gray-600">IP: {login.ip_address || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">
                      Device: {login.browser || 'Unknown'} on {login.os || 'Unknown'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    login.login_status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {login.login_status || 'success'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6: Earnings Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaChartLine className="text-2xl text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Earnings Breakdown</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Direct Bonuses</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(earnings?.direct_bonuses || 0)}</p>
              <p className="text-xs text-blue-600 mt-1">
                {bonus_status?.bonuses_received || 0}/2 slots used
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Matching Bonuses</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(earnings?.matching_bonuses || 0)}</p>
              <p className="text-xs text-green-600 mt-1">
                {team_stats?.total_matches || 0} matches
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">Monthly Awards</p>
              <p className="text-2xl font-bold text-yellow-800">{formatCurrency(earnings?.monthly_payouts || 0)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Total Earned</p>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(user_info.total_earnings || 0)}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Total Withdrawn</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(user_info.total_withdrawals || 0)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Total Deposited</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(user_info.total_deposited || 0)}</p>
            </div>
          </div>
        </div>

        {/* Wallet Adjustment Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {walletAction === 'credit' ? '➕ Add Funds' : '➖ Reduce Funds'}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>User:</strong> @{username}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Wallet:</strong> {selectedWallet === 'karudaa' ? 'Karudaa' : 'Income'} Wallet
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Current Balance:</strong> {formatCurrency(
                    selectedWallet === 'karudaa' ? user_info.karudaa_wallet : user_info.income_wallet
                  )}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {adjustAmount && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    New Balance: {formatCurrency(
                      parseFloat(selectedWallet === 'karudaa' ? user_info.karudaa_wallet : user_info.income_wallet) +
                      (walletAction === 'credit' ? 1 : -1) * parseFloat(adjustAmount || 0)
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWalletSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="text-3xl text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-800">Confirm Wallet Adjustment</h3>
              </div>
              
              <div className="space-y-2 mb-4 text-sm">
                <p><strong>Operation:</strong> {walletAction === 'credit' ? 'Credit (Add)' : 'Debit (Reduce)'}</p>
                <p><strong>Wallet:</strong> {selectedWallet === 'karudaa' ? 'Karudaa' : 'Income'} Wallet</p>
                <p><strong>User:</strong> @{username} ({user_info.email})</p>
                <p><strong>Amount:</strong> {walletAction === 'credit' ? '+' : '-'}{formatCurrency(adjustAmount)}</p>
                <p><strong>Reason:</strong> {adjustReason}</p>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Current Balance:</strong> {formatCurrency(
                  selectedWallet === 'karudaa' ? user_info.karudaa_wallet : user_info.income_wallet
                )}</p>
                <p className="text-sm"><strong>New Balance:</strong> {formatCurrency(
                  parseFloat(selectedWallet === 'karudaa' ? user_info.karudaa_wallet : user_info.income_wallet) +
                  (walletAction === 'credit' ? 1 : -1) * parseFloat(adjustAmount || 0)
                )}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ This action will be logged and cannot be undone. Are you sure?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWalletAdjustment}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm Action
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
                Wallet Adjusted Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                The {selectedWallet === 'karudaa' ? 'Karudaa' : 'Income'} wallet has been updated.
                The action has been logged.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setAdjustAmount('');
                  setAdjustReason('');
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserDetailPage;
