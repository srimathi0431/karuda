import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useAuth } from '../../context/AuthContext';
import { FaUniversity, FaMobileAlt, FaMoneyBillWave, FaCopy, FaCheck, FaWhatsapp, FaDownload, FaUpload, FaCheckCircle, FaHistory } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api';

const UserDeposit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [depositHistory, setDepositHistory] = useState([]);
  const [copiedField, setCopiedField] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    payment_method: 'UPI',
    transaction_id: '',
    payment_receipt: null,
    notes: ''
  });
  
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user?.username]);

  const fetchData = async () => {
    if (!user?.username) return;
    
    try {
      setLoading(true);
      const [settingsRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/payment-settings`),
        axios.get(`${API_BASE_URL}/user/${user.username}/deposit-history?limit=5`)
      ]);
      
      if (settingsRes.data.success) {
        setPaymentSettings(settingsRes.data.settings);
      }
      
      if (historyRes.data.success) {
        setDepositHistory(historyRes.data.deposits || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const copyAllBankDetails = () => {
    if (!paymentSettings) return;
    
    const details = `Bank Name: ${paymentSettings.bank_name}
Account Name: ${paymentSettings.account_name}
Account Number: ${paymentSettings.account_number}
IFSC Code: ${paymentSettings.ifsc_code}
Branch: ${paymentSettings.branch_name}`;
    
    copyToClipboard(details, 'all');
  };

  const shareViaWhatsApp = () => {
    if (!paymentSettings) return;
    
    const message = `🏦 *Karudaa Marketing - Payment Details*

💰 Package Amount: ₹6000

🏦 *Bank Details:*
Bank Name: ${paymentSettings.bank_name}
Account Name: ${paymentSettings.account_name}
Account Number: ${paymentSettings.account_number}
IFSC Code: ${paymentSettings.ifsc_code}
Branch: ${paymentSettings.branch_name}

📱 You can also pay via UPI by scanning QR code on website.

🌐 Complete payment: https://srikaruda.shop/account/deposit`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setFormData({ ...formData, payment_receipt: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.transaction_id) {
      alert('Please enter transaction ID');
      return;
    }
    
    if (!formData.payment_receipt) {
      alert('Please upload payment receipt');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    try {
      setSubmitting(true);
      
      const submitData = new FormData();
      submitData.append('username', user.username);
      submitData.append('package_amount', 6000);
      submitData.append('payment_method', formData.payment_method);
      submitData.append('transaction_id', formData.transaction_id);
      submitData.append('notes', formData.notes);
      submitData.append('file', formData.payment_receipt);
      
      const response = await axios.post(`${API_BASE_URL}/packages/deposit`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSuccessData(response.data);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          payment_method: 'UPI',
          transaction_id: '',
          payment_receipt: null,
          notes: ''
        });
        setReceiptPreview(null);
      }
    } catch (error) {
      console.error('Deposit submission failed:', error);
      alert(error.response?.data?.detail || 'Failed to submit deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'approved' ? '✅ Approved' : status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
      </span>
    );
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800">💰 Deposit Payment</h1>
          <p className="text-gray-600 mt-2">Complete your package payment</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg font-bold text-blue-900">Package Amount: ₹6,000</p>
          </div>
        </div>

        {/* Bank Details */}
        {paymentSettings?.bank_active && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaUniversity className="text-2xl text-green-600" />
              <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium text-gray-900">{paymentSettings.bank_name}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentSettings.bank_name, 'bank_name')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedField === 'bank_name' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-600" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-medium text-gray-900">{paymentSettings.account_name}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentSettings.account_name, 'account_name')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedField === 'account_name' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-600" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-gray-900">{paymentSettings.account_number}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentSettings.account_number, 'account_number')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedField === 'account_number' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-600" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">IFSC Code</p>
                  <p className="font-medium text-gray-900">{paymentSettings.ifsc_code}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentSettings.ifsc_code, 'ifsc_code')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedField === 'ifsc_code' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-600" />}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium text-gray-900">{paymentSettings.branch_name}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentSettings.branch_name, 'branch_name')}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedField === 'branch_name' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-600" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyAllBankDetails}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                {copiedField === 'all' ? <FaCheck /> : <FaCopy />}
                {copiedField === 'all' ? 'Copied!' : 'Copy All Details'}
              </button>
              <button
                onClick={shareViaWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp />
                Share via WhatsApp
              </button>
            </div>
          </div>
        )}

        {/* QR Code */}
        {paymentSettings?.upi_active && paymentSettings?.qr_code_path && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaMobileAlt className="text-2xl text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Scan QR Code to Pay</h2>
            </div>
            
            <div className="inline-block p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
              <img
                src={`https://srikaruda.shop${paymentSettings.qr_code_path}`}
                alt="UPI QR Code"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>
            
            <p className="text-gray-600 mt-3">Google Pay | PhonePe | Paytm</p>
            
            {paymentSettings.upi_id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg inline-block">
                <p className="text-sm text-gray-600">UPI ID: <span className="font-medium text-gray-900">{paymentSettings.upi_id}</span></p>
              </div>
            )}
            
            <div className="flex gap-3 justify-center mt-4">
              <a
                href={`https://srikaruda.shop${paymentSettings.qr_code_path}`}
                download
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaDownload />
                Download QR
              </a>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUpload className="text-2xl text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Upload Payment Proof</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash Deposit">Cash Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID *
              </label>
              <input
                type="text"
                value={formData.transaction_id}
                onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter transaction ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Receipt *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {receiptPreview && (
                <div className="mt-3">
                  <img src={receiptPreview} alt="Receipt Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 font-medium"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Submit Deposit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Deposit History */}
        {depositHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaHistory className="text-2xl text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Your Deposit History</h2>
              </div>
              <button
                onClick={() => navigate('/account/package')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            
            <div className="space-y-3">
              {depositHistory.map((deposit, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">₹{deposit.package_amount}</p>
                    <p className="text-xs text-gray-600">{new Date(deposit.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(deposit.status)}
                    <p className="text-xs text-gray-600 mt-1">#{deposit.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ✅ Confirm Deposit Submission
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Amount:</span>
                  <span className="font-bold text-gray-900">₹6,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{formData.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-gray-900">{formData.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt:</span>
                  <span className="font-medium text-green-600">✓ Uploaded</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Important:</strong><br/>
                  • Ensure transaction ID is correct<br/>
                  • Receipt should be clear<br/>
                  • Wait for admin approval
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && successData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                🎉 Deposit Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Your deposit has been submitted successfully!
              </p>
              
              <div className="space-y-2 mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit ID:</span>
                  <span className="font-bold text-gray-900">#{successData.package?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900">₹6,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-yellow-600 font-medium">⏳ Pending Approval</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                You will be notified once admin approves your deposit.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/account/package')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Deposits
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    fetchData();
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default UserDeposit;
