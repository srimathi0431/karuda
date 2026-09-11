import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductCarousel({ products, title, subtitle }) {
  const { toggleWishlist, wishlist } = useShop();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(2);
        setIsMobile(true);
      } else if (width < 768) {
        setItemsPerView(2);
        setIsMobile(false);
      } else if (width < 1024) {
        setItemsPerView(3);
        setIsMobile(false);
      } else {
        setItemsPerView(4);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleViewPackages = (e) => {
    e.preventDefault();
    navigate('/packages');
  };

  return (
    <div className="relative">
      {/* Header */}
      {title && (
        <div className="text-center mb-8 animate-fadeIn">
          {subtitle && (
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        </div>
      )}

      {/* Mobile: Simple 2-Column Grid */}
      {isMobile ? (
        <div className="grid grid-cols-2 gap-3 px-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-2 left-2">
                    <span className={`
                      px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm
                      ${product.badge === 'Bestseller' ? 'bg-yellow-400 text-yellow-900' : ''}
                      ${product.badge === 'New' ? 'bg-green-500 text-white' : ''}
                      ${product.badge === 'Premium' ? 'bg-purple-600 text-white' : ''}
                      ${product.badge === 'Trending' ? 'bg-pink-500 text-white' : ''}
                    `}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlistToggle(e, product)}
                  className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-colors ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 text-xs mb-2 line-clamp-2 min-h-[2rem]">
                  {product.name}
                </h3>

                {/* Display Only Label */}
                <div className="text-[9px] text-gray-500 mb-2 text-center">
                  Included in Package
                </div>

                {/* View Packages Button */}
                <button
                  onClick={handleViewPackages}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-1.5 rounded text-[10px] font-semibold flex items-center justify-center gap-1 hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  <Package className="w-3 h-3" />
                  View Packages
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Desktop/Tablet: Carousel */
        <div className="relative px-12 group">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="group/card block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-4 left-4">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                            ${product.badge === 'Bestseller' ? 'bg-yellow-400 text-yellow-900' : ''}
                            ${product.badge === 'New' ? 'bg-green-500 text-white' : ''}
                            ${product.badge === 'Premium' ? 'bg-purple-600 text-white' : ''}
                            ${product.badge === 'Trending' ? 'bg-pink-500 text-white' : ''}
                            animate-pulse shadow-lg
                          `}>
                            {product.badge}
                          </span>
                        </div>
                      )}

                      {/* Quick Actions - Wishlist Only & View Packages */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                        <button
                          onClick={handleViewPackages}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 shadow-lg font-semibold flex items-center gap-2"
                        >
                          <Package className="w-5 h-5" />
                          View Packages
                        </button>
                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                            isInWishlist(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'
                          }`}
                          title="Add to Wishlist"
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover/card:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 text-center">
                        Included in Package
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(maxIndex + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
