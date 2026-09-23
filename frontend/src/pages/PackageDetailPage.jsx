import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPackageById } from '../data/packages';
import { useShop } from '../context/ShopContext';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPackageToCart, buyPackageNow } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const packageData = getPackageById(id);

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            View All Packages
          </button>
        </div>
      </div>
    );
  }

  // Support both single image and images array
  const packageImages = packageData.images || [packageData.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? packageImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % packageImages.length);
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hi, I am interested in the ${packageData.name}. Please share the complete details.`;
    const whatsappUrl = `https://wa.me/919629266357?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Package Image Carousel */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl bg-gray-100 h-full min-h-[400px] lg:min-h-[600px]">
                {/* Images */}
                {packageImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${packageData.name} - ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}

                {/* Navigation Arrows */}
                {packageImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Carousel Indicators */}
                {packageImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {packageImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentImageIndex
                            ? 'w-8 h-3 bg-white'
                            : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Badge */}
                {packageData.badge && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                    {packageData.badge}
                  </div>
                )}

                {/* Discount Badge */}
                {packageData.discount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                    {packageData.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="flex flex-col">
              {/* Package Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {packageData.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{packageData.price.toLocaleString('en-IN')}
                </span>
                {packageData.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{packageData.originalPrice.toLocaleString('en-IN')}
                    </span>
                    {packageData.discount && (
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                        Save {packageData.discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Item Count */}
              {packageData.itemCount && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">{packageData.itemCount} Items Included</span>
                </div>
              )}

              {/* Package Includes */}
              {packageData.includes && (
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-lg mb-6">
                  <span className="font-semibold text-sm">📦 {packageData.includes}</span>
                </div>
              )}

              <div className="border-b mb-6"></div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {packageData.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-rose-500 hover:text-rose-600 transition-colors font-semibold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none font-semibold"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-rose-500 hover:text-rose-600 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              {/* WhatsApp Enquiry Button */}
              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
