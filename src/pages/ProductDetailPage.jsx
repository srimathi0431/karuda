import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';
import { Package, Check } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const { toggleWishlist, isInWishlist } = useShop();
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const handleEnquirySubmit = () => {
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
    }, 3000);
  };

  const handleWhatsAppShare = () => {
    const message = `Hi, I am interested in this product: ${product.name}. Please share the details.`;
    const whatsappUrl = `https://wa.me/919629266357?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/shop" className="btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="animate-fade-in">
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            <h1 className="text-4xl font-display font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Elegant and timeless dress perfect for any occasion. Made with premium quality fabric for ultimate comfort and style.
              This beautiful piece will make you feel confident and stylish wherever you go.
            </p>

            {/* Display Only Notice */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-purple-900 text-lg">Available as part of a KARUDA Package</h3>
              </div>
              <p className="text-purple-700 mb-4">
                This product is included in our curated packages. Individual products cannot be purchased separately.
              </p>
              <button
                onClick={() => navigate('/packages')}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                View All Packages
              </button>
            </div>

            {/* Product Action Options */}
            <div className="space-y-3 mb-8">
              {/* Option 1: Enquiry Submitted */}
              <button
                onClick={handleEnquirySubmit}
                disabled={enquirySubmitted}
                className={`w-full py-4 rounded-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2 ${
                  enquirySubmitted
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-xl'
                }`}
              >
                {enquirySubmitted ? (
                  <>
                    <Check className="w-5 h-5" />
                    Enquiry Submitted
                  </>
                ) : (
                  'Submit Enquiry'
                )}
              </button>

              {/* Option 2: Send Product Image on WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Send Product Image on WhatsApp
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="font-semibold">Package Purchase Only</p>
                  <p className="text-sm text-gray-600">Available in curated packages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">On all package orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💝</span>
                <div>
                  <p className="font-semibold">Quality Assured</p>
                  <p className="text-sm text-gray-600">Premium quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products - Display Only */}
        <div>
          <h2 className="text-3xl font-display font-bold mb-4">You May Also Like</h2>
          <p className="text-gray-600 mb-8">These products are also included in our packages</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <div key={item.id} className="card overflow-hidden group">
                <Link to={`/product/${item.id}`} className="block">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs py-1 px-2 rounded text-center">
                      Included in Package
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
