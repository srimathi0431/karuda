import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useAuth } from '../../context/AuthContext';
import { packageOrderAPI } from '../../services/api';
import UserPagination from '../../components/user/UserPagination';
import { FaSearch, FaBox, FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const rowsPerPage = 10;

  // Fetch package orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.username) return;
      
      try {
        setLoading(true);
        const response = await packageOrderAPI.getUserOrders(user.username);
        if (response.success) {
          setOrders(response.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.username]);

  const filteredOrders = orders.filter(
    (order) =>
      (order.order_id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusInfo = (status) => {
    const statusMap = {
      'placed': { icon: FaClock, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Order Placed' },
      'confirmed': { icon: FaCheckCircle, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Confirmed' },
      'shipped': { icon: FaTruck, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Shipped' },
      'delivered': { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-100', label: 'Delivered' },
      'cancelled': { icon: FaTimesCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Cancelled' }
    };
    return statusMap[status?.toLowerCase()] || statusMap['placed'];
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800">Loading orders...</h1>
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
          <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-1">Track and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-blue-500">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Delivered</p>
            <p className="text-3xl font-bold text-green-500">
              {statusCounts['delivered'] || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">In Transit</p>
            <p className="text-3xl font-bold text-purple-500">
              {(statusCounts['shipped'] || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">Processing</p>
            <p className="text-3xl font-bold text-yellow-500">
              {(statusCounts['placed'] || 0) + (statusCounts['confirmed'] || 0)}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, product, or status..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Orders Grid - Modern Card Layout */}
        <div className="space-y-4">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`https://srikaruda.shop${order.image_path}`}
                          alt={order.product_name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{order.product_name}</h3>
                            <p className="text-sm text-gray-600">Order #{order.order_id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500">Order Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(order.created_at).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Package ID</p>
                            <p className="text-sm font-medium text-gray-900">#{order.package_id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Updated</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(order.updated_at).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </p>
                          </div>
                          <div className="text-right md:text-left">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                            >
                              <FaBox className="text-xs" /> Track Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      {['placed', 'confirmed', 'shipped', 'delivered'].map((step, idx) => {
                        const stepInfo = getStatusInfo(step);
                        const StepIcon = stepInfo.icon;
                        const isActive = ['placed', 'confirmed', 'shipped', 'delivered'].indexOf(order.status?.toLowerCase()) >= idx;
                        const isCurrent = order.status?.toLowerCase() === step;
                        
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isActive ? stepInfo.bg : 'bg-gray-200'
                              }`}>
                                <StepIcon className={`text-lg ${isActive ? stepInfo.color : 'text-gray-400'}`} />
                              </div>
                              <p className={`text-xs mt-2 ${isCurrent ? 'font-bold' : ''} ${
                                isActive ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {stepInfo.label}
                              </p>
                            </div>
                            {idx < 3 && (
                              <div className={`flex-1 h-1 mx-2 ${
                                isActive && !isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                              }`}></div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No orders found matching your search' : 'No orders yet'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Your package orders will appear here
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Order Tracking</h2>
                    <p className="text-gray-600 mt-1">Order #{selectedOrder.order_id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 text-3xl font-light"
                  >
                    ×
                  </button>
                </div>

                {/* Product Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://srikaruda.shop${selectedOrder.image_path}`}
                      alt={selectedOrder.product_name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      onError={(e) => e.target.src = '/images/placeholder.png'}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedOrder.product_name}</h3>
                      <p className="text-gray-600 mt-1">Package #{selectedOrder.package_id}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Timeline</h3>
                  <div className="space-y-4">
                    {['placed', 'confirmed', 'shipped', 'delivered'].map((step, idx) => {
                      const stepInfo = getStatusInfo(step);
                      const StepIcon = stepInfo.icon;
                      const isCompleted = ['placed', 'confirmed', 'shipped', 'delivered'].indexOf(selectedOrder.status?.toLowerCase()) >= idx;
                      const isCurrent = selectedOrder.status?.toLowerCase() === step;
                      
                      return (
                        <div key={step} className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted ? stepInfo.bg : 'bg-gray-100'
                          }`}>
                            <StepIcon className={`text-xl ${isCompleted ? stepInfo.color : 'text-gray-400'}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {stepInfo.label}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {isCompleted && isCurrent ? 'In progress' : isCompleted ? 'Completed' : 'Pending'}
                            </p>
                            {isCompleted && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(selectedOrder.updated_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.order_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Package ID</p>
                      <p className="font-semibold text-gray-900">#{selectedOrder.package_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default UserOrders;
