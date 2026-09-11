import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const PackageCard = ({ package: pkg }) => {
  const navigate = useNavigate();
  const { addPackageToCart, buyPackageNow } = useShop();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Support both single image and images array
  const packageImages = pkg.images || [pkg.image];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (packageImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % packageImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [packageImages.length]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? packageImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % packageImages.length);
  };

  const handleViewDetails = () => {
    navigate(`/package/${pkg.id}`);
  };

  const handleWhatsAppEnquiry = (e) => {
    e.stopPropagation();
    const message = `Hi, I am interested in the ${pkg.name}. Please share the complete details.`;
    const whatsappUrl = `https://wa.me/919629266357?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Package Image Carousel */}
      <div 
        className="relative overflow-hidden h-72 bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images */}
        <div className="relative h-full">
          {packageImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${pkg.name} - ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-105' 
                  : 'opacity-0 scale-100'
              } ${isHovered ? 'scale-110' : 'scale-105'}`}
              style={{
                transitionProperty: 'opacity, transform',
                transitionDuration: index === currentImageIndex ? '700ms' : '0ms'
              }}
            />
          ))}
        </div>

        {/* Navigation Arrows - Show on hover (desktop) */}
        {packageImages.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Carousel Indicators */}
        {packageImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {packageImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentImageIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Badge */}
        {pkg.badge && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            {pkg.badge}
          </div>
        )}

        {/* Discount Badge */}
        {pkg.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            {pkg.discount}% OFF
          </div>
        )}

        {/* Item Count */}
        {pkg.itemCount && (
          <div className="absolute top-16 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium z-10">
            {pkg.itemCount} Items
          </div>
        )}

        {/* Includes Badge */}
        {pkg.includes && (
          <div className="absolute top-16 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
            {pkg.includes}
          </div>
        )}
      </div>

      {/* Package Info */}
      <div className="p-5">
        {/* Package Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {pkg.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            ₹{pkg.price.toLocaleString('en-IN')}
          </span>
          {pkg.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{pkg.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* View Details */}
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-rose-500 hover:text-rose-600 transition-colors duration-200 font-medium"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {/* WhatsApp Enquiry */}
          <button
            onClick={handleWhatsAppEnquiry}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enquire on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
