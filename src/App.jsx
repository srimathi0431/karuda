import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { UserPanelProvider } from './context/UserPanelContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import TrackingPage from './pages/TrackingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ContactPage from './pages/ContactPage';
import ShippingPage from './pages/ShippingPage';
import ReturnsPage from './pages/ReturnsPage';
import SizeGuidePage from './pages/SizeGuidePage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import OrdersPage from './pages/admin/OrdersPage';
import TrackingPageAdmin from './pages/admin/TrackingPage';
import BonusPage from './pages/admin/BonusPage';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// User Panel Pages (Account Pages)
import UserDashboard from './pages/user/UserDashboard';
import UserReferrals from './pages/user/UserReferrals';
import UserTeam from './pages/user/UserTeam';
import UserMatchingBonus from './pages/user/UserMatchingBonus';
import UserRewards from './pages/user/UserRewards';
import UserProducts from './pages/user/UserProducts';
import UserOrders from './pages/user/UserOrders';
import UserTransactions from './pages/user/UserTransactions';
import UserP2P from './pages/user/UserP2P';
import UserProfile from './pages/user/UserProfile';
import ProtectedUserRoute from './components/ProtectedUserRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <ShopProvider>
        <AdminProvider>
          <UserPanelProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedAdminRoute>
                      <UsersPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedAdminRoute>
                      <OrdersPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/tracking"
                  element={
                    <ProtectedAdminRoute>
                      <TrackingPageAdmin />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/bonus"
                  element={
                    <ProtectedAdminRoute>
                      <BonusPage />
                    </ProtectedAdminRoute>
                  }
                />

                {/* User Panel Routes - /account with nested routes */}
                <Route
                  path="/account"
                  element={
                    <ProtectedUserRoute>
                      <UserDashboard />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/referrals"
                  element={
                    <ProtectedUserRoute>
                      <UserReferrals />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/team"
                  element={
                    <ProtectedUserRoute>
                      <UserTeam />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/matching-bonus"
                  element={
                    <ProtectedUserRoute>
                      <UserMatchingBonus />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/rewards"
                  element={
                    <ProtectedUserRoute>
                      <UserRewards />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/products"
                  element={
                    <ProtectedUserRoute>
                      <UserProducts />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/orders"
                  element={
                    <ProtectedUserRoute>
                      <UserOrders />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/transactions"
                  element={
                    <ProtectedUserRoute>
                      <UserTransactions />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/p2p"
                  element={
                    <ProtectedUserRoute>
                      <UserP2P />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/profile"
                  element={
                    <ProtectedUserRoute>
                      <UserProfile />
                    </ProtectedUserRoute>
                  }
                />

                {/* User Routes */}
                <Route
                  path="/*"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/shop" element={<ShopPage />} />
                          <Route path="/packages" element={<PackagesPage />} />
                          <Route path="/package/:id" element={<PackageDetailPage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/tracking" element={<TrackingPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignUpPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/shipping" element={<ShippingPage />} />
                          <Route path="/returns" element={<ReturnsPage />} />
                          <Route path="/size-guide" element={<SizeGuidePage />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  }
                />
              </Routes>
            </BrowserRouter>
          </UserPanelProvider>
        </AdminProvider>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
