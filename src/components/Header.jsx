import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { Search, Heart, ShoppingCart, Menu, X, User, LogIn, Package } from 'lucide-react';

const Header = () => {
  const { getCartCount, wishlist } = useShop();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const searchResults = searchQuery.length > 0
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Packages', path: '/packages' },
    { name: 'About', path: '/about' },
    { name: 'Track Order', path: '/tracking' },
    { name: 'Account', path: isAuthenticated ? '/account' : '/login' },
    { name: 'Products', path: '/shop' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-3 group"
          >
            {/* Symbol Logo */}
            <img 
              src="/images/splash.png" 
              alt="Karuda Logo" 
              className="h-8 md:h-10 w-auto group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                // Fallback to text if image doesn't load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback text logo */}
            <span className="hidden text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              KARUDA
            </span>
            
            {/* Word Logo */}
            <img 
              src="/images/word.png" 
              alt="Karuda" 
              className="h-6 md:h-8 w-auto hidden sm:block group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to text if image doesn't load
                e.target.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 text-sm font-medium hover:text-primary-600 transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                placeholder="Search for sarees, dresses..."
                className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-300 rounded-full focus:border-primary-500 focus:outline-none transition-all duration-300 hover:border-gray-400 text-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-2 rounded-full hover:scale-110 transition-transform duration-300"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            
            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border max-h-96 overflow-y-auto animate-slideDown z-50">
                <div className="bg-purple-50 border-b border-purple-200 px-4 py-2">
                  <p className="text-xs text-purple-700 font-medium flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Products display only • Purchase via packages
                  </p>
                </div>
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 border-b last:border-0 transition-all duration-300 group"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs capitalize">{product.category}</p>
                      <p className="text-purple-600 text-[10px] mt-1">Included in package</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919629266357?text=Hello%20Sri%20Karuda%20Network%20Marketing%2C%20I%20would%20like%20to%20know%20more%20about%20your%20packages."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block relative group hover:text-green-600 transition-colors duration-300"
              title="Chat on WhatsApp"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            
            <Link 
              to={isAuthenticated ? '/account' : '/login'} 
              className="hidden md:block relative group hover:text-primary-600 transition-colors duration-300"
              title={isAuthenticated ? 'My Account' : 'Login'}
            >
              {isAuthenticated ? (
                <User className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <LogIn className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              )}
            </Link>

            <Link 
              to="/wishlist" 
              className="relative group hover:text-primary-600 transition-colors duration-300"
            >
              <Heart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <Link 
              to="/cart" 
              className="relative group hover:text-primary-600 transition-colors duration-300"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden hover:text-primary-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 border-2 border-gray-300 rounded-full focus:border-primary-500 focus:outline-none text-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-1.5 rounded-full"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white animate-slideDown">
          <div className="container-custom py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 text-sm font-medium hover:text-primary-600 py-2 border-b"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
