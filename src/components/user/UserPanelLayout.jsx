import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaUserFriends, 
  FaDollarSign, 
  FaGift, 
  FaShoppingBag, 
  FaShoppingCart, 
  FaExchangeAlt, 
  FaHistory, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const UserPanelLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/account', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/account/referrals', label: 'My Referral', icon: <FaUsers /> },
    { path: '/account/team', label: 'My Team', icon: <FaUserFriends /> },
    { path: '/account/matching-bonus', label: 'Matching Bonus', icon: <FaDollarSign /> },
    { path: '/account/rewards', label: 'Reward & Records', icon: <FaGift /> },
    { path: '/account/products', label: 'Products', icon: <FaShoppingBag /> },
    { path: '/account/orders', label: 'Order', icon: <FaShoppingCart /> },
    { path: '/account/transactions', label: 'Transaction History', icon: <FaHistory /> },
    { path: '/account/p2p', label: 'P2P', icon: <FaExchangeAlt /> },
    { path: '/account/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (path === '/account') {
      return location.pathname === '/account';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed top-20 left-4 z-50 lg:hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div className="flex min-h-screen bg-gray-50 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 lg:static ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
            <h2 className="text-xl font-bold">User Panel</h2>
            <p className="text-pink-100 text-sm mt-1">Manage your account</p>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
              
              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserPanelLayout;
