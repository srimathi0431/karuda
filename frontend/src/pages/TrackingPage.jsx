import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const { orders } = useShop();
  const [orderId, setOrderId] = useState(orderIdFromUrl || '');
  const [searchedOrder, setSearchedOrder] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = orders.find(order => order.id.toString() === orderId);
    setSearchedOrder(found || null);
  };

  const displayOrder = orderIdFromUrl
    ? orders.find(order => order.id.toString() === orderIdFromUrl)
    : searchedOrder;

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-display font-bold mb-8 text-center">Track Your Order</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="card p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              required
            />
            <button type="submit" className="btn-primary">
              Track Order
            </button>
          </div>
        </form>

        {/* Order Details */}
        {displayOrder ? (
          <div className="card p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Order #{displayOrder.id}</h2>
                <p className="text-gray-600">{new Date(displayOrder.date).toLocaleDateString()}</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                {displayOrder.status}
              </span>
            </div>

            {/* Tracking Steps */}
            <div className="mb-8">
              <div className="relative">
                {[
                  { label: 'Order Placed', completed: true },
                  { label: 'Processing', completed: true },
                  { label: 'Shipped', completed: displayOrder.status !== 'Processing' },
                  { label: 'Delivered', completed: displayOrder.status === 'Delivered' },
                ].map((step, index) => (
                  <div key={index} className="flex items-center mb-8 last:mb-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step.completed ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
              <p className="text-gray-700">{displayOrder.name}</p>
              <p className="text-gray-700">{displayOrder.address}</p>
              <p className="text-gray-700">{displayOrder.city}, {displayOrder.state} - {displayOrder.pincode}</p>
              <p className="text-gray-700">Phone: {displayOrder.phone}</p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold text-lg mb-3">Order Items</h3>
              {displayOrder.items.map(item => (
                <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-bold text-primary-600">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="text-right pt-4 border-t">
                <p className="text-2xl font-bold text-primary-600">Total: ₹{displayOrder.total}</p>
              </div>
            </div>
          </div>
        ) : orderIdFromUrl || searchedOrder === null ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">Enter your order ID to track your shipment</p>
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-red-600 font-semibold mb-2">Order not found</p>
            <p className="text-gray-600">Please check your order ID and try again</p>
          </div>
        )}

        {/* My Orders */}
        {orders.length > 0 && !orderIdFromUrl && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">₹{order.total}</p>
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setOrderId(order.id.toString());
                      setSearchedOrder(order);
                    }}
                    className="btn-secondary"
                  >
                    Track
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
