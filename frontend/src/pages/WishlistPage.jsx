import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Package, Trash2 } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useShop();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items here</p>
          <Link to="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite products • Purchase via packages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="card overflow-hidden group">
              <Link to={`/product/${product.id}`} className="relative block">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                >
                  <svg className="w-5 h-5 fill-primary-600 text-primary-600" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </Link>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Display Only Label */}
                <div className="text-xs text-gray-500 mb-3 text-center">
                  Included in Package
                </div>
                
                {/* View Packages Button */}
                <button
                  onClick={() => navigate('/packages')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 mb-2"
                >
                  <Package className="w-4 h-4" />
                  View Packages
                </button>
                
                {/* Remove Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
