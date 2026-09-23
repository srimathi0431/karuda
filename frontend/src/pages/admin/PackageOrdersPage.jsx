import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Pagination from '../../components/admin/Pagination';
import { packageOrderAPI } from '../../services/api';
import { FaSearch, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle, FaFilter } from 'react-icons/fa';

const ITEMS_PER_PAGE = 20;

export default function PackageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await packageOrderAPI.getAllOrders(ITEMS_PER_PAGE, offset);
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = 
      order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      'placed': { icon: FaClock, color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', label: 'Order Placed' },
      'confirmed': { icon: FaCheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      'shipped': { icon: FaTruck, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      'delivered': { icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', label: 'Delivered' },
      'cancelled': { icon: FaTimesCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    return statusMap[status?.toLowerCase()] || statusMap['placed'];
  };

  const statusCounts = {
    all: orders.length,
    placed: orders.filter(o => o.status === 'placed').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setUpdating(true);
      const response = await packageOrderAPI.updateStatus(selectedOrder.order_id, newStatus);
      
      if (response.success) {
        showMessage('success', 'Order status updated successfully!');
        setShowUpdateModal(false);
        fetchOrders(); // Refresh orders
      } else {
        showMessage('error', response.message || 'Failed to update status');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Message Toast */}
        {message.text && (
          <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FaBox className="text-4xl" />
            <div>
              <h1 className="text-3xl font-bold">Package Orders Management</h1>
              <p className="text-blue-100 mt-1">Manage all product orders from packages</p>
            </div>
          </div>

          {/* Status Counts */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold">{statusCounts.all}</p>
              <p className="text-xs text-blue-100 mt-1">Total Orders</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold text-yellow-300">{statusCounts.placed}</p>
              <p className="text-xs text-blue-100 mt-1">Placed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold text-blue-300">{statusCounts.confirmed}</p>
              <p className="text-xs text-blue-100 mt-1">Confirmed</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold text-purple-300">{statusCounts.shipped}</p>
              <p className="text-xs text-blue-100 mt-1">Shipped</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold text-green-300">{statusCounts.delivered}</p>
              <p className="text-xs text-blue-100 mt-1">Delivered</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm text-center">
              <p className="text-2xl font-bold text-red-300">{statusCounts.cancelled}</p>
              <p className="text-xs text-blue-100 mt-1">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative md:w-64">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`https://srikaruda.shop${order.image_path}`}
                          alt={order.product_name}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{order.product_name}</h3>
                            <p className="text-sm text-gray-600">Order #{order.order_id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badge}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Customer</p>
                            <p className="text-sm font-semibold text-gray-900">{order.username}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Package ID</p>
                            <p className="text-sm font-semibold text-gray-900">#{order.package_id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Order Date</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Updated</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(order.updated_at).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short'
                              })}
                            </p>
                          </div>
                          <div className="text-right md:text-left">
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-medium"
                            >
                              Update Status
                            </button>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="flex items-center gap-2">
                          {['placed', 'confirmed', 'shipped', 'delivered'].map((step, idx) => {
                            const stepInfo = getStatusInfo(step);
                            const StepIcon = stepInfo.icon;
                            const isActive = ['placed', 'confirmed', 'shipped', 'delivered'].indexOf(order.status?.toLowerCase()) >= idx;
                            const isCurrent = order.status?.toLowerCase() === step;
                            
                            return (
                              <React.Fragment key={step}>
                                <div className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isActive ? stepInfo.bg : 'bg-gray-100'
                                  }`}>
                                    <StepIcon className={`text-sm ${isActive ? stepInfo.color : 'text-gray-400'}`} />
                                  </div>
                                  <p className={`text-xs mt-1 ${isCurrent ? 'font-bold' : ''} ${
                                    isActive ? 'text-gray-900' : 'text-gray-400'
                                  }`}>
                                    {stepInfo.label}
                                  </p>
                                </div>
                                {idx < 3 && (
                                  <div className={`flex-1 h-1 ${
                                    isActive && !isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery || statusFilter !== 'all' ? 'No orders found matching your filters' : 'No package orders yet'}
              </p>
            </div>
          )}
        </div>

        {/* Update Status Modal */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Update Order Status</h3>
                
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`https://srikaruda.shop${selectedOrder.image_path}`}
                      alt={selectedOrder.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                    <div>
                      <p className="font-bold text-gray-900">{selectedOrder.product_name}</p>
                      <p className="text-sm text-gray-600">Order #{selectedOrder.order_id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Customer:</p>
                      <p className="font-semibold">{selectedOrder.username}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Package ID:</p>
                      <p className="font-semibold">#{selectedOrder.package_id}</p>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                  >
                    <option value="placed">🟡 Order Placed</option>
                    <option value="confirmed">🔵 Confirmed</option>
                    <option value="shipped">🟣 Shipped</option>
                    <option value="delivered">🟢 Delivered</option>
                    <option value="cancelled">🔴 Cancelled</option>
                  </select>
                </div>

                {/* Status Change Info */}
                {newStatus !== selectedOrder.status && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      Status will change from <span className="font-bold">{getStatusInfo(selectedOrder.status).label}</span> to{' '}
                      <span className="font-bold">{getStatusInfo(newStatus).label}</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                    disabled={updating || newStatus === selectedOrder.status}
                  >
                    {updating ? 'Updating...' : 'Confirm Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
