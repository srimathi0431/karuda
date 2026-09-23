import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { packageAPI } from '../../services/api';
import { Eye, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function DepositsPage() {
  const { adminUser } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [deposits, setDeposits] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [reviewAction, setReviewAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const itemsPerPage = 20;

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await packageAPI.getAllPackages(
        statusFilter || null,
        itemsPerPage,
        offset
      );
      
      setDeposits(response.packages || []);
      setTotal(response.total || 0);
    } catch (error) {
      showMessage('error', 'Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleViewReceipt = (deposit) => {
    setSelectedDeposit(deposit);
    setShowReceiptModal(true);
  };

  const handleReviewDeposit = (deposit) => {
    setSelectedDeposit(deposit);
    setAdminNotes('');
    setShowReviewModal(true);
  };

  const handleActionClick = (action) => {
    if (action === 'reject' && !adminNotes.trim()) {
      showMessage('error', 'Please provide rejection reason');
      return;
    }
    
    setReviewAction(action);
    setShowReviewModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedDeposit) return;
    
    try {
      setSubmitting(true);
      
      let response;
      if (reviewAction === 'approve') {
        response = await packageAPI.approvePackage(
          selectedDeposit.id,
          adminUser.email,
          adminNotes
        );
      } else {
        response = await packageAPI.rejectPackage(
          selectedDeposit.id,
          adminUser.email,
          adminNotes
        );
      }
      
      if (response.success) {
        showMessage('success', `Deposit ${reviewAction}d successfully!`);
        setShowConfirmModal(false);
        setSelectedDeposit(null);
        setAdminNotes('');
        fetchDeposits();
      } else {
        showMessage('error', response.message || 'Action failed');
      }
    } catch (error) {
      showMessage('error', error.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      deposit.username?.toLowerCase().includes(search) ||
      deposit.name?.toLowerCase().includes(search) ||
      deposit.transaction_id?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Message Toast */}
        {message.text && (
          <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Package Deposits</h1>
          <p className="text-gray-600 mt-2">Review and approve payment receipts</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username, name, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Deposits Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading deposits...</p>
            </div>
          ) : filteredDeposits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No deposits found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDeposits.map((deposit) => (
                      <tr key={deposit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{deposit.username}</div>
                            <div className="text-sm text-gray-500">{deposit.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          ₹{deposit.package_amount}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {deposit.payment_method}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                          {deposit.transaction_id}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(deposit.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            deposit.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewReceipt(deposit)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Receipt"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {deposit.status === 'pending' && (
                              <button
                                onClick={() => handleReviewDeposit(deposit)}
                                className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                              >
                                Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} deposits
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && selectedDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Payment Receipt</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">User:</span>
                  <span className="font-semibold">{selectedDeposit.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">₹{selectedDeposit.package_amount}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-semibold">{selectedDeposit.payment_method}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-semibold font-mono">{selectedDeposit.transaction_id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {new Date(selectedDeposit.submitted_at).toLocaleString()}
                  </span>
                </div>
                {selectedDeposit.admin_notes && (
                  <div className="py-2">
                    <span className="text-gray-600">Notes:</span>
                    <p className="mt-1 text-gray-800">{selectedDeposit.admin_notes}</p>
                  </div>
                )}
              </div>

              {selectedDeposit.payment_receipt && (
                <div className="mb-6">
                  <img
                    src={selectedDeposit.payment_receipt}
                    alt="Receipt"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Review Deposit</h3>
              
              <div className="mb-4">
                <p className="text-gray-600">User: <span className="font-semibold text-gray-900">{selectedDeposit.username}</span></p>
                <p className="text-gray-600">Amount: <span className="font-semibold text-gray-900">₹{selectedDeposit.package_amount}</span></p>
              </div>

              {selectedDeposit.payment_receipt && (
                <img
                  src={selectedDeposit.payment_receipt}
                  alt="Receipt"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleActionClick('reject')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleActionClick('approve')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedDeposit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">
                Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {reviewAction === 'approve' 
                  ? 'Approve deposit for:'
                  : 'Reject deposit for:'}
              </p>
              <p className="font-semibold text-gray-900 mb-2">User: {selectedDeposit.username}</p>
              <p className="font-semibold text-gray-900 mb-4">Amount: ₹{selectedDeposit.package_amount}</p>
              
              {reviewAction === 'approve' && (
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg mb-4">
                  This will activate the user's package and allow them to select a product.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                    reviewAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
