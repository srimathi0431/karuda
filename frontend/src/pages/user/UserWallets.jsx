import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaWallet, FaMoneyBillWave, FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const UserWallets = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (username) {
      fetchWalletData();
    }
  }, [username]);

  const fetchWalletData = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      
      // Fetch wallet
      const walletResponse = await mlmAPI.getWallets(username);
      if (walletResponse.success) {
        setWallet(walletResponse.wallet);
      }

      // Fetch MLM wallet transactions (new transactions)
      const mlmTransResponse = await mlmAPI.getTransactions(username, null, 20);
      const mlmTransactions = mlmTransResponse.success ? (mlmTransResponse.transactions || []) : [];

      // Fetch old shopping system transactions
      const oldTransResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api'}/user/${username}/transactions`);
      const oldTransData = await oldTransResponse.json();
      const oldTransactions = oldTransData.success ? (oldTransData.transactions || []) : [];

      // Merge both transaction lists and sort by date (newest first)
      const allTransactions = [...mlmTransactions, ...oldTransactions].sort((a, b) => {
        const dateA = new Date(a.created_at || a.transaction_date || a.date);
        const dateB = new Date(b.created_at || b.transaction_date || b.date);
        return dateB - dateA;
      });

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      alert('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction) => {
    // Handle both old and new transaction formats
    const amount = transaction.amount || 0;
    const type = transaction.transaction_type || transaction.type;
    
    if (type === 'Credit' || parseFloat(amount) >= 0) {
      return <FaArrowUp className="text-green-500" />;
    }
    return <FaArrowDown className="text-red-500" />;
  };

  const getTransactionAmount = (transaction) => {
    return Math.abs(parseFloat(transaction.amount || 0));
  };

  const getTransactionType = (transaction) => {
    return transaction.transaction_type || transaction.type || 'N/A';
  };

  const getTransactionDescription = (transaction) => {
    return transaction.description || transaction.remarks || 'No description';
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wallets...</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3">
            <FaWallet className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">My Wallets</h1>
              <p className="opacity-90 mt-1">Manage your Karudaa and Income wallets</p>
            </div>
          </div>
        </div>

        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Karudaa Wallet */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaWallet className="text-3xl" />
                <h3 className="text-xl font-bold">Karudaa Wallet</h3>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">₹{parseFloat(wallet?.karudaa_wallet || 0).toLocaleString()}</p>
            <p className="opacity-90 text-sm">For package deposits only</p>
            <div className="mt-4 pt-4 border-t border-purple-400">
              <p className="text-sm opacity-90">Use this wallet to enroll in packages</p>
            </div>
          </div>

          {/* Income Wallet */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-3xl" />
                <h3 className="text-xl font-bold">Income Wallet</h3>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">₹{parseFloat(wallet?.income_wallet || 0).toLocaleString()}</p>
            <p className="opacity-90 text-sm">Withdrawable balance</p>
            <div className="mt-4 pt-4 border-t border-green-400">
              <a 
                href="/account/withdraw"
                className="inline-block bg-white text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Withdraw Funds
              </a>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              ₹{parseFloat(wallet?.total_earnings || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Withdrawals</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ₹{parseFloat(wallet?.total_withdrawals || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Deposited</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              ₹{parseFloat(wallet?.total_deposited || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Last Updated</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              {wallet?.updated_at ? formatDate(wallet.updated_at) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/account/deposit"
              className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 transition-colors"
            >
              <FaMoneyBillWave className="text-2xl text-purple-600" />
              <div>
                <p className="font-medium text-gray-800">Deposit Funds</p>
                <p className="text-sm text-gray-600">Add to Karudaa Wallet</p>
              </div>
            </a>
            <a
              href="/account/withdraw"
              className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 transition-colors"
            >
              <FaArrowDown className="text-2xl text-green-600" />
              <div>
                <p className="font-medium text-gray-800">Withdraw</p>
                <p className="text-sm text-gray-600">From Income Wallet</p>
              </div>
            </a>
            <a
              href="/account/package"
              className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <FaWallet className="text-2xl text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Enroll Package</p>
                <p className="text-sm text-gray-600">Use Karudaa Wallet</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaHistory className="text-2xl text-gray-600" />
                <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
              </div>
              <a href="/account/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All →
              </a>
            </div>
          </div>
          
          <div className="p-6">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((trans, index) => (
                  <div key={trans.id || `trans-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      {getTransactionIcon(trans)}
                      <div>
                        <p className="font-medium text-gray-800">{getTransactionType(trans)}</p>
                        <p className="text-sm text-gray-600">{getTransactionDescription(trans)}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(trans.created_at || trans.transaction_date || trans.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        (trans.transaction_type || trans.type) === 'Credit' || parseFloat(trans.amount) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {(trans.transaction_type || trans.type) === 'Credit' || parseFloat(trans.amount) >= 0 ? '+' : '-'}₹{getTransactionAmount(trans).toLocaleString()}
                      </p>
                      {trans.balance_after && (
                        <p className="text-xs text-gray-500">
                          Balance: ₹{parseFloat(trans.balance_after).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserWallets;
