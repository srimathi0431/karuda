import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaUniversity, FaMobileAlt, FaMoneyBillWave, FaSave, FaUpload, FaEye, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://srikaruda.shop/api';

const BankDetailsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    ifsc_code: '',
    branch_name: '',
    bank_active: true
  });

  // UPI Details State
  const [upiDetails, setUpiDetails] = useState({
    upi_id: '',
    qr_code_path: '',
    upi_active: true
  });

  // Cash Details State
  const [cashDetails, setCashDetails] = useState({
    cash_instructions: '',
    cash_address: '',
    cash_active: false
  });

  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/payment-settings`);
      
      if (response.data.success) {
        const settings = response.data.settings;
        
        setBankDetails({
          bank_name: settings.bank_name || '',
          account_name: settings.account_name || '',
          account_number: settings.account_number || '',
          ifsc_code: settings.ifsc_code || '',
          branch_name: settings.branch_name || '',
          bank_active: settings.bank_active ?? true
        });

        setUpiDetails({
          upi_id: settings.upi_id || '',
          qr_code_path: settings.qr_code_path || '',
          upi_active: settings.upi_active ?? true
        });

        setCashDetails({
          cash_instructions: settings.cash_instructions || '',
          cash_address: settings.cash_address || '',
          cash_active: settings.cash_active ?? false
        });

        if (settings.qr_code_path) {
          setQrPreview(`https://srikaruda.shop${settings.qr_code_path}`);
        }
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      alert('Failed to load payment settings');
    } finally {
      setLoading(false);
    }
  };

  const handleQrFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadQr = async () => {
    if (!qrFile) {
      alert('Please select a QR code image first');
      return;
    }

    try {
      setUploadingQr(true);
      const formData = new FormData();
      formData.append('file', qrFile);

      const response = await axios.post(`${API_BASE_URL}/admin/upload-qr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUpiDetails(prev => ({
          ...prev,
          qr_code_path: response.data.qr_code_path
        }));
        setQrFile(null);
        alert('QR code uploaded successfully!');
      }
    } catch (error) {
      console.error('Failed to upload QR:', error);
      alert('Failed to upload QR code');
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSaveBank = () => {
    setPendingChanges({ type: 'bank', data: bankDetails });
    setShowConfirmModal(true);
  };

  const handleSaveUpi = () => {
    setPendingChanges({ type: 'upi', data: upiDetails });
    setShowConfirmModal(true);
  };

  const handleSaveCash = () => {
    setPendingChanges({ type: 'cash', data: cashDetails });
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    if (!pendingChanges) return;

    try {
      setSaving(true);
      
      const payload = {
        admin_email: 'admin@karudaa.com',
        bank_data: pendingChanges.type === 'bank' ? pendingChanges.data : null,
        upi_data: pendingChanges.type === 'upi' ? pendingChanges.data : null,
        cash_data: pendingChanges.type === 'cash' ? pendingChanges.data : null
      };

      const response = await axios.put(`${API_BASE_URL}/admin/payment-settings`, payload);

      if (response.data.success) {
        setShowConfirmModal(false);
        setShowSuccessModal(true);
        setPendingChanges(null);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaUniversity className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bank Details Configuration</h1>
              <p className="text-gray-600 mt-1">Manage payment information shown to users</p>
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FaEye />
            Preview User View
          </button>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUniversity className="text-2xl text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Bank Account Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <input
                type="text"
                value={bankDetails.bank_name}
                onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State Bank of India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name *
              </label>
              <input
                type="text"
                value={bankDetails.account_name}
                onChange={(e) => setBankDetails({ ...bankDetails, account_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Karudaa Marketing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                value={bankDetails.account_number}
                onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code *
              </label>
              <input
                type="text"
                value={bankDetails.ifsc_code}
                onChange={(e) => setBankDetails({ ...bankDetails, ifsc_code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SBIN0001234"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                value={bankDetails.branch_name}
                onChange={(e) => setBankDetails({ ...bankDetails, branch_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Chennai Main Branch"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bankDetails.bank_active}
                onChange={(e) => setBankDetails({ ...bankDetails, bank_active: e.target.checked })}
                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Active (Show to users)</span>
            </label>
          </div>

          <button
            onClick={handleSaveBank}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FaSave />
            Save Bank Details
          </button>
        </div>

        {/* UPI QR Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMobileAlt className="text-2xl text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">UPI QR Code</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current QR Code
              </label>
              {qrPreview ? (
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={qrPreview}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 h-56 flex items-center justify-center">
                  <p className="text-gray-500">No QR code uploaded</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New QR Code
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB (PNG, JPG)</p>

              {qrFile && (
                <button
                  onClick={handleUploadQr}
                  disabled={uploadingQr}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <FaUpload />
                  {uploadingQr ? 'Uploading...' : 'Upload QR Code'}
                </button>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={upiDetails.upi_id}
                  onChange={(e) => setUpiDetails({ ...upiDetails, upi_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="karudaa@sbi"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={upiDetails.upi_active}
                  onChange={(e) => setUpiDetails({ ...upiDetails, upi_active: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Active (Show to users)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveUpi}
            disabled={saving}
            className="mt-4 flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <FaSave />
            Save UPI Details
          </button>
        </div>

        {/* Cash/Other Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMoneyBillWave className="text-2xl text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">Cash/Other Payment</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Instructions
            </label>
            <textarea
              value={cashDetails.cash_instructions}
              onChange={(e) => setCashDetails({ ...cashDetails, cash_instructions: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter instructions for cash or other payment methods..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address (if needed)
            </label>
            <textarea
              value={cashDetails.cash_address}
              onChange={(e) => setCashDetails({ ...cashDetails, cash_address: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Office address for cash payments..."
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={cashDetails.cash_active}
              onChange={(e) => setCashDetails({ ...cashDetails, cash_active: e.target.checked })}
              className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">Active (Show to users)</span>
          </div>

          <button
            onClick={handleSaveCash}
            disabled={saving}
            className="mt-4 flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <FaSave />
            Save Cash Payment Details
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Changes
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to save these payment settings? Users will see the updated information immediately.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setPendingChanges(null);
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Confirm'
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
                Settings Saved Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Payment settings have been updated. Users will now see the new information.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  fetchSettings();
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Preview Modal - Will be implemented next */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">User View Preview</h3>
              
              {/* Bank Details Preview */}
              {bankDetails.bank_active && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                  <h4 className="font-bold text-lg mb-3">🏦 Bank Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Bank Name:</span> {bankDetails.bank_name}</p>
                    <p><span className="font-medium">Account Name:</span> {bankDetails.account_name}</p>
                    <p><span className="font-medium">Account Number:</span> {bankDetails.account_number}</p>
                    <p><span className="font-medium">IFSC Code:</span> {bankDetails.ifsc_code}</p>
                    <p><span className="font-medium">Branch:</span> {bankDetails.branch_name}</p>
                  </div>
                </div>
              )}

              {/* QR Code Preview */}
              {upiDetails.upi_active && qrPreview && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg text-center">
                  <h4 className="font-bold text-lg mb-3">📱 Scan QR Code</h4>
                  <img src={qrPreview} alt="QR" className="w-48 h-48 mx-auto" />
                  {upiDetails.upi_id && (
                    <p className="mt-2 text-sm">UPI ID: {upiDetails.upi_id}</p>
                  )}
                </div>
              )}

              {/* Cash Instructions Preview */}
              {cashDetails.cash_active && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                  <h4 className="font-bold text-lg mb-3">💵 Cash Payment</h4>
                  <p className="text-sm whitespace-pre-wrap">{cashDetails.cash_instructions}</p>
                  {cashDetails.cash_address && (
                    <p className="text-sm mt-2"><span className="font-medium">Address:</span> {cashDetails.cash_address}</p>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BankDetailsPage;
