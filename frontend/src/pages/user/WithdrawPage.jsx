import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { mlmAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaMoneyBillWave, FaCheckCircle, FaInfoCircle, FaHistory } from 'react-icons/fa';

const WithdrawPage = () => {
  const { user } = useAuth();
  const username = user?.username;
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [settings, setSettings] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [amount, setAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateFee();
  }, [amount, settings]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch wallet
      const walletRes = await mlmAPI.getWallets(username);
      if (walletRes.success) {
        setWallet(walletRes.wallet);
      }

      // Fetch withdrawal settings
      const settingsRes = await mlmAPI.getWithdrawalSettings();
      if (settingsRes.success) {
        setSettings(settingsRes.settings);
      }

      // Fetch withdrawal history
      const withdrawalsRes = await mlmAPI.getUserWithdrawals(username);
      if (withdrawalsRes.success) {
        setWithdrawals(withdrawalsRes.requests || []);
      }

      // Fetch bank details
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api'}/bank-details/${username}`);
      const data = await response.json();
      if (data.success && data.bank_details) {
        setBankDetails(data.bank_details);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    if (!amount || !settings) {
      setCalculatedFee(0);
      setNetAmount(0);
      return;
    }

    const amt = parseFloat(amount);
    let fee = 0;

    if (settings.service_fee_type === 'percentage') {
      fee = (amt * parseFloat(settings.service_fee_value)) / 100;
    } else {
      fee = parseFloat(settings.service_fee_value);
    }

    setCalculatedFee(fee);
    setNetAmount(amt - fee);
  };

  const validateWithdrawal = () => {
    if (!bankDetails) {
      alert('Please add your bank details first from Profile page');
      return false;
    }

    const amt = parseFloat(amount);
    
    if (!amt || amt <= 0) {
      alert('Please enter a valid amount');
      return false;
    }

    if (amt < settings.min_withdrawal) {
      alert(`Minimum withdrawal amount is ₹${settings.min_withdrawal}`);
      return false;
    }

    if (amt > settings.max_withdrawal) {
      alert(`Maximum withdrawal amount is ₹${settings.max_withdrawal}`);
      return false;
    }

    if (amt > parseFloat(wallet.income_wallet)) {
      alert('Insufficient balance in Income Wallet');
      return false;
    }

    // Check daily limit
    const today = new Date().toDateString();
    const todayWithdrawals = withdrawals.filter(w => {
      const wDate = new Date(w.requested_at).toDateString();
      return wDate === today && w.status !== 'rejected';
    });
    const todayTotal = todayWithdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0);
    
    if (todayTotal + amt > settings.daily_limit) {
      alert(`Daily limit exceeded. You can withdraw ₹${(settings.daily_limit - todayTotal).toFixed(2)} more today`);
      return false;
    }

    return true;
  };

  const handleWithdraw = () => {
    if (!validateWithdrawal()) return;
    setShowConfirmModal(true);
  };

  const confirmWithdraw = async () => {
    try {
      setProcessing(true);

      await mlmAPI.createWithdrawal(username, parseFloat(amount));

      setShowConfirmModal(false);
      setShowSuccessModal(true);
      setAmount('');
      fetchData();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      alert(error.message || 'Failed to create withdrawal request');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading withdrawal page...</p>
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
            <FaMoneyBillWave className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">Withdraw Funds</h1>
              <p className="opacity-90 mt-1">Withdraw from your Income Wallet to your bank account</p>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <p className="text-lg opacity-90 mb-2">Available Balance</p>
          <p className="text-4xl font-bold">₹{parseFloat(wallet?.income_wallet || 0).toLocaleString()}</p>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Request Withdrawal</h3>

          {!bankDetails ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-yellow-600 text-xl mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">Bank Details Required</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please add your bank details from the Profile page before making a withdrawal request.
                  </p>
                  <a
                    href="/account/profile"
                    className="inline-block mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  >
                    Go to Profile
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Bank Details Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Withdrawal will be sent to:</p>
                <div className="text-sm text-gray-800">
                  <p className="font-medium">{bankDetails.bank_name}</p>
                  <p>Account: {bankDetails.account_number}</p>
                  <p>IFSC: {bankDetails.ifsc_code}</p>
                  <p>Holder: {bankDetails.account_holder_name}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ${settings?.min_withdrawal} | Max: ${settings?.max_withdrawal}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  min={settings?.min_withdrawal}
                  max={settings?.max_withdrawal}
                  step="100"
                />
              </div>

              {/* Fee Calculation */}
              {amount && parseFloat(amount) > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Requested Amount:</span>
                      <span className="font-medium text-gray-900">₹{parseFloat(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Service Fee ({settings?.service_fee_type === 'percentage' ? `${settings?.service_fee_value}%` : `₹${settings?.service_fee_value}`}):</span>
                      <span className="font-medium text-red-600">-₹{calculatedFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-blue-300 flex justify-between">
                      <span className="font-bold text-gray-800">You Will Receive:</span>
                      <span className="font-bold text-green-600 text-lg">₹{netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdrawal Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-2">Withdrawal Information:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum: ₹{settings?.min_withdrawal?.toLocaleString()}</li>
                  <li>• Maximum: ₹{settings?.max_withdrawal?.toLocaleString()}</li>
                  <li>• Daily Limit: ₹{settings?.daily_limit?.toLocaleString()}</li>
                  <li>• Processing Time: {settings?.processing_days} business days</li>
                  <li>• Service Fee: {settings?.service_fee_type === 'percentage' ? `${settings?.service_fee_value}%` : `₹${settings?.service_fee_value}`}</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleWithdraw}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Withdrawal
              </button>
            </>
          )}
        </div>

        {/* Withdrawal History */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaHistory className="text-2xl text-gray-600" />
              <h3 className="text-lg font-bold text-gray-800">Withdrawal History</h3>
            </div>
          </div>
          <div className="p-6">
            {withdrawals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No withdrawal requests yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{withdrawal.request_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(withdrawal.requested_at)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{parseFloat(withdrawal.amount).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-red-600">-₹{parseFloat(withdrawal.service_fee).toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-600">₹{parseFloat(withdrawal.net_amount).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(withdrawal.status)}`}>
                            {withdrawal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Confirm Withdrawal
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Withdrawal Details:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Amount:</span>
                    <span className="font-medium">₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Service Fee:</span>
                    <span className="font-medium text-red-600">-₹{calculatedFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">You Will Receive:</span>
                    <span className="font-bold text-green-600">₹{netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Bank Details:</p>
                <p className="text-xs text-blue-700">{bankDetails?.bank_name}</p>
                <p className="text-xs text-blue-700">A/c: {bankDetails?.account_number}</p>
                <p className="text-xs text-blue-700">{bankDetails?.account_holder_name}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Processing time: {settings?.processing_days} business days. The amount will be debited from your Income Wallet immediately.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWithdraw}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm Request
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
                Withdrawal Request Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Your withdrawal request has been submitted successfully. It will be processed within {settings?.processing_days} business days.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default WithdrawPage;
