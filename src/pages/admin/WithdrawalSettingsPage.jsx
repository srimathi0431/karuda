import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { mlmAPI } from '../../services/api';
import { FaCog, FaSave, FaCheckCircle } from 'react-icons/fa';

const WithdrawalSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [settings, setSettings] = useState({
    min_withdrawal: 500,
    max_withdrawal: 50000,
    service_fee_type: 'percentage',
    service_fee_value: 2.0,
    processing_day: 5,
    daily_limit: 10000,
    processing_days: 3,
    min_account_age_days: 30
  });

  const adminEmail = localStorage.getItem('adminEmail') || 'admin@karudaa.com';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await mlmAPI.getWithdrawalSettings();
      if (response.success) {
        setSettings(response.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        ...settings,
        admin_email: adminEmail
      };

      await mlmAPI.updateWithdrawalSettings(payload);
      
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(error.message || 'Failed to save settings');
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
            <p className="text-gray-600">Loading settings...</p>
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
            <FaCog className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Withdrawal Settings</h1>
              <p className="text-gray-600 mt-1">Configure withdrawal limits, fees, and processing rules</p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Withdrawal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Withdrawal Amount (₹)
              </label>
              <input
                type="number"
                value={settings.min_withdrawal}
                onChange={(e) => handleChange('min_withdrawal', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="100"
                step="100"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum amount users can withdraw</p>
            </div>

            {/* Maximum Withdrawal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Withdrawal Amount (₹)
              </label>
              <input
                type="number"
                value={settings.max_withdrawal}
                onChange={(e) => handleChange('max_withdrawal', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                step="1000"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum amount per withdrawal request</p>
            </div>

            {/* Service Fee Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Fee Type
              </label>
              <select
                value={settings.service_fee_type}
                onChange={(e) => handleChange('service_fee_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            {/* Service Fee Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Fee Value {settings.service_fee_type === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={settings.service_fee_value}
                onChange={(e) => handleChange('service_fee_value', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step={settings.service_fee_type === 'percentage' ? '0.1' : '10'}
              />
              <p className="mt-1 text-xs text-gray-500">
                {settings.service_fee_type === 'percentage' 
                  ? `Example: ₹10,000 withdrawal = ₹${(10000 * settings.service_fee_value / 100).toFixed(2)} fee`
                  : `Fixed fee of ₹${settings.service_fee_value} per withdrawal`}
              </p>
            </div>

            {/* Processing Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Day of Month (1-28)
              </label>
              <input
                type="number"
                value={settings.processing_day}
                onChange={(e) => handleChange('processing_day', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="28"
              />
              <p className="mt-1 text-xs text-gray-500">
                Withdrawals requested after this day will be processed next month
              </p>
            </div>

            {/* Daily Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Withdrawal Limit Per User (₹)
              </label>
              <input
                type="number"
                value={settings.daily_limit}
                onChange={(e) => handleChange('daily_limit', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                step="1000"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum total withdrawal amount per day per user</p>
            </div>

            {/* Processing Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Time (days)
              </label>
              <input
                type="number"
                value={settings.processing_days}
                onChange={(e) => handleChange('processing_days', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="30"
              />
              <p className="mt-1 text-xs text-gray-500">Expected processing time in business days</p>
            </div>

            {/* Minimum Account Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Account Age (days)
              </label>
              <input
                type="number"
                value={settings.min_account_age_days}
                onChange={(e) => handleChange('min_account_age_days', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="365"
              />
              <p className="mt-1 text-xs text-gray-500">
                Users must be registered for this many days before withdrawing
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Preview - What Users Will See:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Minimum Withdrawal: ₹{settings.min_withdrawal.toLocaleString()}</p>
              <p>• Maximum Withdrawal: ₹{settings.max_withdrawal.toLocaleString()}</p>
              <p>• Service Fee: {settings.service_fee_type === 'percentage' 
                ? `${settings.service_fee_value}%` 
                : `₹${settings.service_fee_value}`}
              </p>
              <p>• Next Processing Date: {new Date(new Date().getFullYear(), new Date().getMonth() + (new Date().getDate() > settings.processing_day ? 1 : 0), settings.processing_day).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>• Processing Time: {settings.processing_days}-{settings.processing_days + 2} business days</p>
              <p>• Daily Limit: ₹{settings.daily_limit.toLocaleString()}</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              <FaSave />
              Save Settings
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ Confirm Settings Update
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">You are about to update:</p>
                <div className="space-y-1 text-sm text-gray-800">
                  <p>• Minimum: ₹{settings.min_withdrawal.toLocaleString()}</p>
                  <p>• Maximum: ₹{settings.max_withdrawal.toLocaleString()}</p>
                  <p>• Service Fee: {settings.service_fee_type === 'percentage' 
                    ? `${settings.service_fee_value}%` 
                    : `₹${settings.service_fee_value}`}
                  </p>
                  <p>• Processing Day: {settings.processing_day} of every month</p>
                  <p>• Daily Limit: ₹{settings.daily_limit.toLocaleString()}</p>
                  <p>• Processing Time: {settings.processing_days} days</p>
                  <p>• Min Account Age: {settings.min_account_age_days} days</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ These settings will apply to all new withdrawal requests immediately.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
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
                    <>
                      <FaCheckCircle />
                      Confirm Changes
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
                Settings Updated Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Withdrawal settings have been updated. These will apply to all new withdrawal requests.
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
      </div>
    </AdminLayout>
  );
};

export default WithdrawalSettingsPage;
