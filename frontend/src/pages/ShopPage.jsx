import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { products, categories } from '../data/products';
import { Heart, Filter, SlidersHorizontal, X, Package } from 'lucide-react';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const { toggleWishlist, isInWishlist } = useShop();

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  let filteredProducts = products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const selectedCategoryName = categories.find(c => c.slug === selectedCategory)?.name || 'All Products';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Banner */}
      <div className="relative bg-cover bg-center py-8 md:py-12" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
        <div className="container-custom relative z-10">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-2 md:mb-3 text-white">
            {searchQuery ? `Search: "${searchQuery}"` : selectedCategoryName}
          </h1>
          <p className="text-white/90 text-sm md:text-base lg:text-lg mb-4">
            Discover {filteredProducts.length} premium products
          </p>
          <p className="text-white/80 text-xs md:text-sm">
            Products are display only • Purchase via Packages
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                <Filter className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-white text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                <SlidersHorizontal className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors bg-white text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm md:mt-7">
              <span className="font-semibold text-primary-600">{filteredProducts.length}</span>
              <span>products found</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Try adjusting your filters or search terms</p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-sm md:text-base">
              <X className="w-4 h-4" />
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/product/${product.id}`} className="relative block">
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3">
                        <span className={`
                          px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide shadow-lg
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
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2.5 rounded-full shadow-lg transition-all duration-300 z-10 ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Display Only Overlay - Hide on Mobile */}
                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center gap-2">
                      <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Display Only
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/packages');
                        }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-110 transition-all duration-300 transform"
                      >
                        <Package className="w-5 h-5" />
                        View Packages
                      </button>
                    </div>
                  </div>
                </Link>
                
                {/* Product Info */}
                <div className="p-2 md:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 text-xs md:text-base mb-1 md:mb-2 line-clamp-2 hover:text-primary-600 transition-colors min-h-[2rem] md:min-h-[3rem]">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Category - Hide on Mobile */}
                  <p className="hidden md:block text-xs text-gray-500 uppercase tracking-wider mb-2">{product.category}</p>
                  
                  {/* Display Only Label */}
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    Included in Package
                  </div>

                  {/* View Packages Button */}
                  <button
                    onClick={() => navigate('/packages')}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-1.5 md:py-2.5 rounded-lg text-[11px] md:text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-1 md:gap-2"
                  >
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    View Packages
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
