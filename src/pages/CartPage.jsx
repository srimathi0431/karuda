import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Package } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your Package Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Browse our curated packages to start shopping</p>
          <Link to="/packages" className="btn-primary inline-flex items-center gap-2">
            <Package className="w-5 h-5" />
            View Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">Package Cart</h1>
          <p className="text-gray-600">Review your selected packages</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div key={`${item.type || 'package'}-${item.id}`} className="card p-4 mb-4 flex gap-4">
                {/* Package Badge */}
                {item.type === 'package' && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Package
                  </div>
                )}
                
                <img
                  src={item.images ? item.images[0] : item.image}
                  alt={item.name}
                  className="w-24 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <Link 
                    to={item.type === 'package' ? `/package/${item.id}` : `/product/${item.id}`} 
                    className="font-semibold text-lg hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  {item.type === 'package' && item.itemCount && (
                    <p className="text-xs text-purple-600 mt-1 font-medium">{item.itemCount} items included</p>
                  )}
                  {item.type === 'package' && item.includes && (
                    <p className="text-xs text-gray-500 mt-1">{item.includes}</p>
                  )}
                  <p className="text-primary-600 font-bold mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary-600">₹{getCartTotal()}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block mb-3">
                Proceed to Checkout
              </Link>
              <Link to="/packages" className="btn-secondary w-full text-center block">
                Browse More Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
