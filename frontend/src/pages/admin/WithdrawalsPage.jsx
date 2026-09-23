import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI } from '../../services/api';
import { FaMoneyCheckAlt, FaCheck, FaTimes, FaEye, FaFilter, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const WithdrawalsPage = () => {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const adminEmail = localStorage.getItem('adminEmail') || 'admin@karudaa.com';

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await mlmAPI.getAllWithdrawals(statusFilter);
      if (response.success) {
        setWithdrawals(response.requests || []);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      alert('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (withdrawal, type) => {
    setSelectedWithdrawal(withdrawal);
    setActionType(type);
    setAdminNotes('');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (actionType === 'reject' && !adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setProcessing(true);
      
      if (actionType === 'approve') {
        await mlmAPI.approveWithdrawal(
          selectedWithdrawal.request_id,
          adminEmail,
          adminNotes
        );
      } else {
        await mlmAPI.rejectWithdrawal(
          selectedWithdrawal.request_id,
          adminEmail,
          adminNotes
        );
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
      fetchWithdrawals();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert(error.message || 'Failed to process withdrawal');
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading withdrawals...</p>
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
            <FaMoneyCheckAlt className="text-3xl text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Withdrawal Management</h1>
              <p className="text-gray-600 mt-1">Review and process user withdrawal requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-800 mt-1">
              {withdrawals.filter(w => w.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 text-sm font-medium">Approved</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {withdrawals.filter(w => w.status === 'approved').length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm font-medium">Rejected</p>
            <p className="text-2xl font-bold text-red-800 mt-1">
              {withdrawals.filter(w => w.status === 'rejected').length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 text-sm font-medium">Total Amount</p>
            <p className="text-2xl font-bold text-blue-800 mt-1">
              ₹{withdrawals.reduce((sum, w) => sum + parseFloat(w.amount), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !statusFilter
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      No {statusFilter || ''} withdrawals found
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {withdrawal.request_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{withdrawal.name}</p>
                          <p className="text-sm text-gray-500">@{withdrawal.username}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{parseFloat(withdrawal.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-red-600">
                          -₹{parseFloat(withdrawal.service_fee).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">
                          ₹{parseFloat(withdrawal.net_amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          <p className="font-medium">{withdrawal.bank_name}</p>
                          <p>A/c: {withdrawal.account_number}</p>
                          <p>IFSC: {withdrawal.ifsc_code}</p>
                          <p>Holder: {withdrawal.account_holder}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(withdrawal.requested_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {withdrawal.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(withdrawal, 'approve')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              title="Approve"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleAction(withdrawal, 'reject')}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              title="Reject"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            {withdrawal.status === 'approved' ? 'Approved' : 'Rejected'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Withdrawal Details:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Request ID:</span> {selectedWithdrawal.request_id}</p>
                  <p><span className="font-medium">User:</span> {selectedWithdrawal.username}</p>
                  <p><span className="font-medium">Amount:</span> ₹{parseFloat(selectedWithdrawal.amount).toLocaleString()}</p>
                  <p><span className="font-medium">Fee:</span> ₹{parseFloat(selectedWithdrawal.service_fee).toLocaleString()}</p>
                  <p><span className="font-medium">Net Amount:</span> ₹{parseFloat(selectedWithdrawal.net_amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason (Required)'}
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={actionType === 'approve' ? 'Add any notes...' : 'Enter reason for rejection...'}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  {actionType === 'approve' 
                    ? '⚠️ Approving will debit the amount from user\'s Income Wallet immediately. This action cannot be undone.'
                    : '⚠️ Rejecting this withdrawal will NOT debit the user\'s wallet. User can resubmit the request.'}
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
                  onClick={confirmAction}
                  disabled={processing}
                  className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    actionType === 'approve' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {actionType === 'approve' ? <FaCheckCircle /> : <FaTimesCircle />}
                      {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
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
                {actionType === 'approve' ? 'Withdrawal Approved!' : 'Withdrawal Rejected'}
              </h3>
              <p className="text-gray-600 mb-6">
                {actionType === 'approve' 
                  ? 'The withdrawal has been approved successfully. User wallet has been debited.'
                  : 'The withdrawal request has been rejected. User has been notified.'}
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedWithdrawal(null);
                  setAdminNotes('');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default WithdrawalsPage;
