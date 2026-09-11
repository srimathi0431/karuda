import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Shield, Truck, Sparkles, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { collections, products } from '../data/products';
import ProductCarousel from '../components/ProductCarousel';
import PackageSection from '../components/PackageSection';
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Scroll animation refs for each section
  const [sareesRef, sareesVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [weddingRef, weddingVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [companyRef, companyVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [summerRef, summerVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [ethnicRef, ethnicVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [westernRef, westernVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [whyChooseRef, whyChooseVisible] = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const [ctaRef, ctaVisible] = useScrollAnimation({ threshold: 0.2, triggerOnce: true });

  // Hero background images carousel
  const heroImages = [
    {
      url: '/images/package.png',
      title: 'KARUDA Packages',
      subtitle: 'PACKAGES',
      description: 'Complete packages combining fashion, lifestyle essentials and more. Two perfect packages to choose from.',
      priceRange: '₹6,000 – ₹12,000',
      categories: 'Saree • Induction Stove • Santhana Kinnam • LIC • Maligai Porulgal',
      type: 'package'
    },
    {
      url: products.find(p => p.category === 'fashion')?.image || '',
      title: 'Saree',
      subtitle: 'PRODUCT',
      description: 'Traditional elegance in every drape. Premium quality sarees included in our packages.',
      priceRange: '',
      categories: 'Fashion • Traditional Wear',
      type: 'product'
    },
    {
      url: products.find(p => p.category === 'electronics')?.image || '',
      title: 'Induction Stove',
      subtitle: 'PRODUCT',
      description: 'Modern cooking technology for your kitchen. Quality electronics in our packages.',
      priceRange: '',
      categories: 'Electronics • Kitchen Appliances',
      type: 'product'
    },
    {
      url: products.find(p => p.category === 'ayurveda')?.image || '',
      title: 'Santhana Kinnam',
      subtitle: 'PRODUCT',
      description: 'Traditional wellness products for your home. Natural ayurveda items included.',
      priceRange: '',
      categories: 'Ayurveda • Traditional Products',
      type: 'product'
    },
    {
      url: products.find(p => p.category === 'insurance')?.image || '',
      title: 'LIC',
      subtitle: 'PRODUCT',
      description: 'Life Insurance Corporation services. Security and peace of mind for your family.',
      priceRange: '',
      categories: 'Insurance • Life Coverage',
      type: 'product'
    },
    {
      url: products.find(p => p.category === 'grocery')?.image || '',
      title: 'Maligai Porulgal',
      subtitle: 'PRODUCT',
      description: 'Essential grocery items for your daily needs. Quality products in every package.',
      priceRange: '',
      categories: 'Grocery • Daily Essentials',
      type: 'product'
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Hero background colors for each slide
  const slideBackgrounds = [
    'from-amber-50 via-orange-50 to-rose-50',      // Warm champagne for saree
    'from-amber-50 via-cream-50 to-yellow-50',     // Premium ivory/champagne for package
    'from-blue-50 via-indigo-50 to-purple-50',     // Cool tone for blue
    'from-pink-50 via-rose-50 to-red-50',          // Soft blush for lehenga
    'from-orange-50 via-amber-50 to-yellow-50',    // Warm beige for package
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compact Premium Split Layout */}
      <section 
        className={`relative min-h-[85vh] lg:h-[700px] flex items-center overflow-hidden transition-all duration-1000 bg-gradient-to-br ${slideBackgrounds[currentSlide]}`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:container-custom py-6 sm:py-8 md:py-10 lg:py-16">
          <div className="grid grid-cols-[45%_55%] sm:grid-cols-[55%_45%] lg:grid-cols-[620px_696px] gap-3 sm:gap-4 md:gap-6 lg:gap-12 items-center max-w-full lg:max-w-[1400px] lg:mx-auto">
            
            {/* LEFT SIDE - Content */}
            <div className="relative z-10 space-y-3 sm:space-y-3 md:space-y-3 lg:space-y-4">
              {/* Badge */}
              <div 
                key={`badge-${currentSlide}`}
                className="inline-flex items-center gap-1.5 sm:gap-2"
                style={{ 
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both'
                }}
              >
                <Sparkles className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4" />
                <span className="text-primary-600 font-semibold uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs lg:text-base">
                  {heroImages[currentSlide].subtitle}
                </span>
              </div>

              {/* Heading - Editorial Style - Responsive sizing */}
              <h1 
                key={`heading-${currentSlide}`}
                className="font-display font-bold text-gray-900 leading-[1.1]"
                style={{ 
                  fontSize: 'clamp(1.5rem, 5.5vw, 3.5rem)',
                  animation: 'fadeInJump 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.22s both'
                }}
              >
                {heroImages[currentSlide].title}
              </h1>

              {/* Description - Show on mobile with better sizing */}
              <p 
                key={`desc-${currentSlide}`}
                className="text-[11px] sm:text-xs md:text-sm lg:text-[22px] xl:text-[22px] text-gray-600 leading-snug sm:leading-relaxed lg:leading-relaxed"
                style={{ 
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.38s both'
                }}
              >
                {heroImages[currentSlide].description}
              </p>

              {/* Package Price Range - Only for package slides */}
              {heroImages[currentSlide].type === 'package' && (
                <div 
                  key={`price-${currentSlide}`}
                  className="space-y-1.5 sm:space-y-2 lg:space-y-2"
                  style={{ 
                    animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.45s both'
                  }}
                >
                  <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-base text-gray-500 uppercase tracking-wide font-semibold">
                    Packages Starting From
                  </div>
                  <div className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {heroImages[currentSlide].priceRange}
                  </div>
                  <div className="text-[10px] sm:text-[11px] md:text-xs lg:text-base text-gray-600 leading-snug">
                    {heroImages[currentSlide].categories}
                  </div>
                </div>
              )}

              {/* Package Purchase Notice - Only for product slides */}
              {heroImages[currentSlide].type === 'product' && (
                <div 
                  key={`notice-${currentSlide}`}
                  className="bg-purple-50 border border-purple-200 rounded-md sm:rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-1.5 md:px-3.5 md:py-1.5 lg:px-4 lg:py-2 inline-flex items-center gap-1.5 sm:gap-2"
                  style={{ 
                    animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.45s both'
                  }}
                >
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-600" />
                  <span className="text-[10px] sm:text-[11px] md:text-xs lg:text-[17px] text-purple-700 font-medium">
                    Purchase via Packages
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div 
                key={`buttons-${currentSlide}`}
                className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 lg:gap-3 pt-1 sm:pt-2"
                style={{ 
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.52s both'
                }}
              >
                <Link 
                  to="/packages" 
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-5 md:py-2.5 lg:px-7 lg:py-3.5 rounded-full font-semibold text-xs sm:text-xs md:text-sm lg:text-xl flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Package className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  {heroImages[currentSlide].type === 'package' ? 'View Packages' : 'View Packages'}
                  <ArrowRight className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {heroImages[currentSlide].type === 'product' && (
                  <Link 
                    to="/shop" 
                    className="bg-white text-gray-900 px-4 py-2.5 sm:px-5 sm:py-2.5 md:px-5 md:py-2.5 lg:px-7 lg:py-3.5 rounded-full font-semibold text-xs sm:text-xs md:text-sm lg:text-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    Browse Products
                  </Link>
                )}
              </div>

              {/* Stats - Compact - Hide on very small screens */}
              <div 
                className="hidden md:flex gap-3 lg:gap-5 xl:gap-6 pt-2 lg:pt-3"
                style={{ 
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.62s both'
                }}
              >
                <div>
                  <div className="text-base md:text-lg lg:text-[28px] font-bold text-primary-600">5000+</div>
                  <div className="text-[9px] md:text-[10px] lg:text-[15px] text-gray-600">Customers</div>
                </div>
                <div>
                  <div className="text-base md:text-lg lg:text-[28px] font-bold text-primary-600">28</div>
                  <div className="text-[9px] md:text-[10px] lg:text-[15px] text-gray-600">Collections</div>
                </div>
                <div>
                  <div className="text-base md:text-lg lg:text-[28px] font-bold text-primary-600">4.9★</div>
                  <div className="text-[9px] md:text-[10px] lg:text-[15px] text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Image Card/Box - Responsive sizing */}
            <div className="relative">
              <div className="relative aspect-[3/4] lg:w-[620px] lg:h-[600px] rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl lg:shadow-2xl bg-white p-2 sm:p-3 md:p-4 lg:p-6">
                {/* Carousel Images with Premium Animation */}
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 overflow-hidden group p-2 sm:p-3 md:p-4 lg:p-6"
                    style={{
                      opacity: index === currentSlide ? 1 : 0,
                      transform: index === currentSlide ? 'scale(1) translateX(0)' : 'scale(0.96) translateX(20px)',
                      transition: 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: index === currentSlide ? 'auto' : 'none',
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ))}

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Decorative Blur Elements - Hide on mobile */}
              <div className="hidden md:block absolute -bottom-4 -right-4 w-24 h-24 bg-primary-200 rounded-full blur-2xl opacity-30 -z-10"></div>
              <div className="hidden md:block absolute -top-4 -left-4 w-32 h-32 bg-accent-200 rounded-full blur-3xl opacity-25 -z-10"></div>
            </div>
          </div>

          {/* Carousel Controls - Compact & Premium - Hidden on mobile */}
          <div className="hidden md:flex items-center justify-between mt-6 md:mt-8 lg:mt-10 lg:max-w-[1400px] lg:mx-auto">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="group w-9 h-9 lg:w-11 lg:h-11 bg-white/80 backdrop-blur-sm hover:bg-primary-600 border border-gray-200 hover:border-primary-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-white transition-colors" />
              </button>

              <button
                onClick={nextSlide}
                className="group w-9 h-9 lg:w-11 lg:h-11 bg-white/80 backdrop-blur-sm hover:bg-primary-600 border border-gray-200 hover:border-primary-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2 lg:gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-7 h-1.5 lg:w-8 lg:h-2 bg-primary-600'
                      : 'w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="flex flex-col items-end">
              <div className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mb-0.5">Slide</div>
              <div className="font-bold">
                <span className="text-lg lg:text-xl text-primary-600">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-xs lg:text-sm text-gray-500">{String(heroImages.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section 
        ref={sareesRef}
        className={`py-20 bg-white transition-all duration-1000 ease-out ${
          sareesVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="container-custom">
          <div 
            className={`flex justify-between items-end mb-12 transition-all duration-700 delay-100 ${
              sareesVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2 md:mb-3 text-gray-900">
                Our Products
              </h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">Quality products for your needs • Included in packages</p>
            </div>
            <Link 
              to="/shop"
              className="group inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl w-fit px-5 py-3 text-sm md:px-8 md:py-4 md:text-base"
            >
              View All Products
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div 
            className={`transition-all duration-700 delay-300 ${
              sareesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <ProductCarousel products={products.filter(p => [1, 2, 3, 4].includes(p.id))} />
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>

      {/* Company Introduction Section */}
      <section 
        ref={companyRef}
        className={`py-16 md:py-24 bg-white relative overflow-hidden transition-all duration-1000 ease-out ${
          companyVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div 
              className={`transition-all duration-700 delay-100 ${
                companyVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-accent-600" />
                <span className="text-accent-600 font-semibold uppercase tracking-wider text-xs md:text-sm">About Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-gray-900">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Karuda</span>
              </h2>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-3 md:mb-4 leading-relaxed">
                Karuda is your premier destination for elegant ethnic wear and contemporary fashion. We believe every woman deserves to feel beautiful and confident in what she wears.
              </p>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-3 md:mb-4 leading-relaxed">
                From traditional sarees to modern wedding attire, from breezy summer collections to timeless ethnic wear - we curate the finest pieces that celebrate Indian heritage while embracing contemporary style.
              </p>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-6 md:mb-8 leading-relaxed">
                Our commitment is to provide premium quality, affordable fashion with exceptional customer service. Every piece is carefully selected to ensure you look and feel your absolute best.
              </p>
              <Link to="/about" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-xl w-fit px-5 py-3 text-sm md:px-8 md:py-4 md:text-base group">
                Discover Our Story
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div 
              className={`grid grid-cols-2 gap-4 md:gap-6 transition-all duration-700 delay-300 ${
                companyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="card p-4 md:p-8 text-center hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-primary-50 to-primary-100">
                <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-primary-600 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-primary-600 mb-1 md:mb-2">5000+</div>
                <div className="text-gray-600 font-medium text-xs md:text-base">Happy Customers</div>
              </div>
              <div className="card p-4 md:p-8 text-center hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-accent-50 to-accent-100">
                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-accent-600 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-accent-600 mb-1 md:mb-2">200+</div>
                <div className="text-gray-600 font-medium text-xs md:text-base">Premium Styles</div>
              </div>
              <div className="card p-4 md:p-8 text-center hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <Star className="w-8 h-8 md:w-12 md:h-12 text-yellow-600 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-yellow-600 mb-1 md:mb-2">4.9★</div>
                <div className="text-gray-600 font-medium text-xs md:text-base">Average Rating</div>
              </div>
              <div className="card p-4 md:p-8 text-center hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-green-50 to-green-100">
                <Shield className="w-8 h-8 md:w-12 md:h-12 text-green-600 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">24/7</div>
                <div className="text-gray-600 font-medium text-xs md:text-base">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-300 to-transparent"></div>

      {/* Premium Packages Section */}
      <PackageSection />

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent-300 to-transparent"></div>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

      {/* Why Choose Us Section */}
      <section 
        ref={whyChooseRef}
        className={`py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white transition-all duration-1000 ease-out ${
          whyChooseVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="container-custom">
          <div 
            className={`text-center mb-12 md:mb-16 transition-all duration-700 delay-100 ${
              whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-3 md:mb-4 text-gray-900">
              Why Choose Karuda?
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
              Your Trusted Partner for Premium Fashion & Ethnic Wear
            </p>
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 md:mt-6 rounded-full"></div>
          </div>

          {/* Main Features Grid */}
          <div 
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-700 delay-200 ${
              whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { 
                icon: Truck, 
                title: 'Free Shipping', 
                desc: 'On all orders above ₹999',
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Shield, 
                title: 'Secure Payment', 
                desc: '100% safe & encrypted',
                color: 'green',
                gradient: 'from-green-500 to-emerald-500'
              },
              { 
                icon: TrendingUp, 
                title: 'Easy Returns', 
                desc: '7-day money back guarantee',
                color: 'orange',
                gradient: 'from-orange-500 to-amber-500'
              },
              { 
                icon: Star, 
                title: 'Quality Assured', 
                desc: 'Premium materials guaranteed',
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="group relative card p-4 md:p-8 text-center hover:shadow-2xl transition-all duration-300 animate-scaleIn overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className={`w-7 h-7 md:w-10 md:h-10 text-${item.color}-600`} />
                    </div>
                    <h3 className="font-bold text-sm md:text-xl mb-2 md:mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-base">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Benefits Section */}
          <div 
            className={`bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100 transition-all duration-700 delay-400 ${
              whyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h3 className="text-xl md:text-3xl font-display font-bold text-center mb-8 md:mb-12 text-gray-900">
              More Reasons to Shop with Us
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Benefit 1 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-100 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">✨</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Handpicked Collection</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Carefully curated designs from top designers and brands across India</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">💎</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Authentic Products</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">100% genuine products with authenticity certificates on premium items</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">🎁</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Gift Wrapping</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Complimentary elegant gift wrapping service on all orders</p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">📞</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">24/7 Support</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Round-the-clock customer service to assist with any queries</p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">🏷️</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Best Prices</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Competitive pricing with regular discounts and seasonal offers</p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="flex gap-4 items-start group">
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl md:text-3xl">⚡</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2 text-gray-900">Fast Delivery</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">Express delivery available for urgent orders across major cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div 
            className={`mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 transition-all duration-700 delay-600 ${
              whyChooseVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-1 md:mb-2">5000+</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl md:text-4xl font-bold text-green-600 mb-1 md:mb-2">28+</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">Product Categories</div>
            </div>
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="text-2xl md:text-4xl font-bold text-orange-600 mb-1 md:mb-2">4.9⭐</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-2xl md:text-4xl font-bold text-purple-600 mb-1 md:mb-2">99%</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`py-12 md:py-20 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden transition-all duration-1000 ease-out ${
          ctaVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-custom text-center relative z-10">
          <h2 
            className={`text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 transition-all duration-700 delay-100 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            Ready to Transform Your Wardrobe?
          </h2>
          <p 
            className={`text-white/90 text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4 transition-all duration-700 delay-300 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore our curated packages and find your perfect style today
          </p>
          <Link 
            to="/packages"
            className={`inline-flex items-center gap-2 md:gap-3 bg-white text-purple-600 px-6 py-3 md:px-10 md:py-5 rounded-full font-semibold text-sm md:text-base lg:text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group ${
              ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: ctaVisible ? '500ms' : '0ms' }}
          >
            <Package className="w-5 h-5" />
            View All Packages
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
