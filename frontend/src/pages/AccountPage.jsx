import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Edit2, Save, X, LogOut, Package, Heart, MapPin, ShoppingBag, Calendar, IndianRupee, Trash2, ShoppingCart, Star, Search, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
  const { wishlist, toggleWishlist, addToCart, buyNow } = useShop();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } });
    }
  }, [isAuthenticated, navigate]);
  
  // User data from auth context
  const [userData, setUserData] = useState(user || {
    name: 'User',
    email: 'user@example.com',
    phone: '+91 9876543210',
    avatar: 'U'
  });

  // Update userData when user changes
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const [editData, setEditData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders.reverse()); // Show latest first
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Handle password change logic here
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordChange(false);
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    const order = orders.find(o => o.id === trackingOrderId);
    if (order) {
      setTrackedOrder(order);
    } else {
      alert('Order not found. Please check your Order ID.');
      setTrackedOrder(null);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 md:py-12">
      <div className="container-custom">
        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Logout Confirmation</h3>
                <p className="text-gray-600">Are you sure you want to logout?</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  No, Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
            My Account
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-white">{userData.avatar}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{userData.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{userData.email}</p>
              </div>

              {/* User Dashboard Link */}
              <Link
                to="/user/dashboard"
                className="block mb-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Go to User Dashboard
              </Link>

              {/* Navigation */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                  {orders.length > 0 && (
                    <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === 'wishlist' 
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('tracking')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === 'tracking' 
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Track Orders
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 rounded-lg font-medium text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fadeIn">
                {/* Profile Information Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm md:text-base">
                          {userData.name}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm md:text-base">
                          {userData.email}
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm md:text-base">
                          {userData.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Password</h2>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Keep your account secure</p>
                    </div>
                    {!showPasswordChange && (
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Lock className="w-4 h-4" />
                        Change Password
                      </button>
                    )}
                  </div>

                  {showPasswordChange ? (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-sm md:text-base"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm md:text-base"
                        >
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                          className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm md:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500 text-sm md:text-base">••••••••</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fadeIn bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Orders</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShoppingBag className="w-4 h-4" />
                    <span>{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                    <Link
                      to="/packages"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      View Packages
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border-2 border-gray-100 rounded-xl p-4 md:p-6 hover:border-primary-200 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'delivered' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(order.date).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                              <div className="text-2xl font-bold text-primary-600 flex items-center gap-1">
                                <IndianRupee className="w-5 h-5" />
                                {order.total}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t pt-4 space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 relative">
                              {item.type === 'package' && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                                  <Package className="w-2.5 h-2.5" />
                                  Package
                                </div>
                              )}
                              <img 
                                src={item.images ? item.images[0] : item.image} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                {item.type === 'package' && item.itemCount && (
                                  <p className="text-[10px] text-purple-600 font-medium">{item.itemCount} items included</p>
                                )}
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Details */}
                        <div className="border-t mt-4 pt-4 grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Payment Method</p>
                            <p className="font-semibold text-gray-900">
                              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Delivery Address</p>
                            <p className="font-semibold text-gray-900">
                              {order.address.city}, {order.address.state} - {order.address.pincode}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4 pt-4 border-t">
                          <Link
                            to={`/tracking?orderId=${order.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-600 rounded-lg font-semibold hover:shadow-md transition-all text-sm"
                          >
                            <MapPin className="w-4 h-4" />
                            Track Order
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="animate-fadeIn bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Wishlist</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>{wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}</span>
                  </div>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h3>
                    <p className="text-gray-600 mb-6">Browse products and save your favorites!</p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((product) => (
                      <div 
                        key={product.id} 
                        className="border-2 border-gray-100 rounded-xl p-4 hover:border-primary-200 transition-all hover:shadow-md"
                      >
                        <div className="relative mb-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                          <p className="text-xs text-purple-600 font-medium">Included in packages</p>

                          <div className="flex gap-2 pt-2">
                            <Link
                              to="/packages"
                              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <Package className="w-4 h-4" />
                              View Packages
                            </Link>
                            <button
                              onClick={() => toggleWishlist(product)}
                              className="px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Track Orders Tab */}
            {activeTab === 'tracking' && (
              <div className="animate-fadeIn bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>

                {/* Order ID Input */}
                <form onSubmit={handleTrackOrder} className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter Order ID
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={trackingOrderId}
                          onChange={(e) => setTrackingOrderId(e.target.value)}
                          placeholder="e.g., KRD12345678"
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="sm:mt-7 bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Track Order
                    </button>
                  </div>
                </form>

                {/* Tracked Order Details */}
                {trackedOrder ? (
                  <div className="space-y-6">
                    {/* Order Info */}
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Order ID</p>
                          <p className="text-xl font-bold text-gray-900">{trackedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Order Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(trackedOrder.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-primary-600">₹{trackedOrder.total}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="relative">
                      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                      
                      <div className="space-y-8">
                        {/* Order Confirmed */}
                        <div className="relative flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-bold text-gray-900">Order Confirmed</h3>
                            <p className="text-sm text-gray-600">Your order has been placed successfully</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(trackedOrder.date).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Order Packed */}
                        <div className="relative flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            trackedOrder.status === 'confirmed' ? 'bg-gray-300' : 'bg-green-500'
                          }`}>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-bold text-gray-900">Order Packed</h3>
                            <p className="text-sm text-gray-600">Your items are being packed</p>
                          </div>
                        </div>

                        {/* Shipped */}
                        <div className="relative flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            trackedOrder.status === 'shipped' || trackedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-bold text-gray-900">Shipped</h3>
                            <p className="text-sm text-gray-600">Your order is on the way</p>
                          </div>
                        </div>

                        {/* Out for Delivery */}
                        <div className="relative flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            trackedOrder.status === 'out_for_delivery' || trackedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-bold text-gray-900">Out for Delivery</h3>
                            <p className="text-sm text-gray-600">Your order will arrive soon</p>
                          </div>
                        </div>

                        {/* Delivered */}
                        <div className="relative flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            trackedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-bold text-gray-900">Delivered</h3>
                            <p className="text-sm text-gray-600">Order has been delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t pt-6">
                      <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {trackedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg relative">
                            {item.type === 'package' && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                                <Package className="w-2.5 h-2.5" />
                                Package
                              </div>
                            )}
                            <img 
                              src={item.images ? item.images[0] : item.image} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                              {item.type === 'package' && item.itemCount && (
                                <p className="text-[10px] text-purple-600 font-medium">{item.itemCount} items included</p>
                              )}
                              <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="border-t pt-6">
                      <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-semibold text-gray-900">{trackedOrder.address.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{trackedOrder.address.address}</p>
                        <p className="text-sm text-gray-600">{trackedOrder.address.city}, {trackedOrder.address.state} - {trackedOrder.address.pincode}</p>
                        <p className="text-sm text-gray-600 mt-2">Phone: {trackedOrder.address.phone}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Enter your Order ID above to track your order</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
