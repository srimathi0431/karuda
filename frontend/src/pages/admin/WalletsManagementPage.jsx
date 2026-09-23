import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI, userAPI } from '../../services/api';
import { FaWallet, FaSearch, FaEye } from 'react-icons/fa';

const WalletsManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers ? await userAPI.getUsers() : await fetch(`${import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api'}/admin/users`).then(r => r.json());
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = async (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
    setLoadingDetails(true);

    try {
      // Fetch wallet
      const walletResponse = await mlmAPI.getWallets(user.username);
      if (walletResponse.success) {
        setWallet(walletResponse.wallet);
      }

      // Fetch recent transactions
      const transResponse = await mlmAPI.getTransactions(user.username, null, 10);
      if (transResponse.success) {
        setTransactions(transResponse.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalKarudaaWallet = users.reduce((sum, user) => sum + (parseFloat(user.wallet_balance) || 0), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
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
            <FaWallet className="text-3xl text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Wallets Management</h1>
              <p className="text-gray-600 mt-1">View and monitor all user wallets</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Total Users</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">{users.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-600 text-sm font-medium">Total Karudaa Wallet</p>
            <p className="text-2xl font-bold text-purple-800 mt-1">₹{totalKarudaaWallet.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Active Users</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username, name, or email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Karudaa Wallet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-purple-600">
                          ₹{parseFloat(user.wallet_balance || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewDetails(user)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <FaEye /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Wallet Details - {selectedUser.name}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading wallet details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Wallet Balances */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-600 text-sm font-medium">Karudaa Wallet</p>
                      <p className="text-2xl font-bold text-purple-800 mt-1">
                        ₹{parseFloat(wallet?.karudaa_wallet || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">For package deposits</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-600 text-sm font-medium">Income Wallet</p>
                      <p className="text-2xl font-bold text-green-800 mt-1">
                        ₹{parseFloat(wallet?.income_wallet || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Withdrawable balance</p>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-600 text-sm font-medium">Total Earnings</p>
                      <p className="text-xl font-bold text-blue-800 mt-1">
                        ₹{parseFloat(wallet?.total_earnings || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm font-medium">Total Withdrawals</p>
                      <p className="text-xl font-bold text-red-800 mt-1">
                        ₹{parseFloat(wallet?.total_withdrawals || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Recent Transactions (Last 10)</h4>
                    {transactions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No transactions yet</p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {transactions.map((trans) => (
                          <div key={trans.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{trans.transaction_type}</p>
                              <p className="text-xs text-gray-500">{trans.description}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(trans.created_at).toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-bold ${
                                parseFloat(trans.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {parseFloat(trans.amount) >= 0 ? '+' : ''}₹{parseFloat(trans.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Bal: ₹{parseFloat(trans.balance_after).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default WalletsManagementPage;
