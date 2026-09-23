import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Package } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart, getBuyNowItem, clearBuyNow } = useShop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Get items based on Buy Now or Cart
  const buyNowItem = isBuyNow ? getBuyNowItem() : null;
  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : cart;
  
  // Calculate total
  const calculateTotal = () => {
    if (isBuyNow && buyNowItem) {
      return buyNowItem.price * (buyNowItem.quantity || 1);
    }
    return getCartTotal();
  };

  // Form data
  const [addressData, setAddressData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  // Generate order ID
  const generateOrderId = () => {
    return 'KRD' + Date.now().toString().slice(-8);
  };

  // Handle address form
  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    return Object.values(addressData).every(val => val.trim() !== '');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep(2);
    } else {
      alert('Please fill all address fields');
    }
  };

  // Handle payment selection
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Generate order ID and save to localStorage
    const newOrderId = generateOrderId();
    const order = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: checkoutItems,
      total: calculateTotal(),
      address: addressData,
      paymentMethod: paymentMethod,
      status: 'confirmed'
    };

    // Save to localStorage orders
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    setOrderId(newOrderId);
    setOrderSuccess(true);
    setCurrentStep(3);
    
    // Clear cart or buy now item
    if (isBuyNow) {
      clearBuyNow();
    } else {
      clearCart();
    }
  };

  if (checkoutItems.length === 0 && !orderSuccess) {
    navigate(isBuyNow ? '/shop' : '/cart');
    return null;
  }

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Order Placed Successfully!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>

              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
                <p className="text-2xl md:text-3xl font-bold text-primary-600 mb-4">
                  {orderId}
                </p>
                <p className="text-xs text-gray-500">
                  Please save this Order ID for tracking your order
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-xl">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-semibold text-gray-900 text-right text-sm">
                    {addressData.city}, {addressData.state}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/account')}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/packages')}
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary-600 hover:text-primary-600 transition-all"
                >
                  Browse Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8 text-center">
            Checkout
          </h1>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold text-gray-700">Address</p>
              </div>

              {/* Line */}
              <div className={`flex-1 h-1 -mx-4 transition-all ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold text-gray-700">Payment</p>
              </div>

              {/* Line */}
              <div className={`flex-1 h-1 -mx-4 transition-all ${currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold text-gray-700">Confirm</p>
              </div>
            </div>
          </div>

          {/* Step 1: Address Details */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary-600" />
                Shipping Address
              </h2>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={addressData.name}
                      onChange={handleAddressChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={addressData.email}
                    onChange={handleAddressChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Address *</label>
                  <textarea
                    name="address"
                    value={addressData.address}
                    onChange={handleAddressChange}
                    placeholder="House No, Building Name, Street, Area"
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-primary-600" />
                Select Payment Method
              </h2>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {/* Cash on Delivery */}
                <label className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-1">Cash on Delivery (COD)</div>
                      <p className="text-sm text-gray-600">Pay when you receive the product</p>
                    </div>
                    <span className="text-3xl">💵</span>
                  </div>
                </label>

                {/* Online Payment */}
                <label className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'online' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-1">Online Payment</div>
                      <p className="text-sm text-gray-600">UPI, Cards, Net Banking, Wallets</p>
                    </div>
                    <span className="text-3xl">💳</span>
                  </div>
                </label>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Order Items Preview */}
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {checkoutItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 relative">
                        {item.type === 'package' && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                            <Package className="w-2.5 h-2.5" />
                            Package
                          </div>
                        )}
                        <img 
                          src={item.images ? item.images[0] : item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                          {item.type === 'package' && item.itemCount && (
                            <p className="text-[10px] text-purple-600 font-medium">{item.itemCount} items</p>
                          )}
                          <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                        </div>
                        <p className="font-bold text-gray-900">₹{item.price * (item.quantity || 1)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({checkoutItems.length})</span>
                      <span className="font-semibold">₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  {isBuyNow && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                      <span className="font-semibold">⚡ Buy Now:</span> Direct checkout for selected item
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    Place Order
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
