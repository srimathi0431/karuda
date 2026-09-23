import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
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
import UserDetailPage from './pages/admin/UserDetailPage';
import OrdersPage from './pages/admin/OrdersPage';
import DepositsPage from './pages/admin/DepositsPage';
import ProductsPage from './pages/admin/ProductsPage';
import PackageOrdersPage from './pages/admin/PackageOrdersPage';
import BankDetailsPage from './pages/admin/BankDetailsPage';
import TrackingPageAdmin from './pages/admin/TrackingPage';
import BonusPage from './pages/admin/BonusPage';
import WalletsManagementPage from './pages/admin/WalletsManagementPage';
import WithdrawalsPage from './pages/admin/WithdrawalsPage';
import WithdrawalSettingsPage from './pages/admin/WithdrawalSettingsPage';
import AwardClaimsPage from './pages/admin/AwardClaimsPage';
import BonusReportsPage from './pages/admin/BonusReportsPage';
import AchievementsPage from './pages/admin/AchievementsPage';
import BinaryTreePage from './pages/admin/BinaryTreePage';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// User Panel Pages (Account Pages)
import UserDashboard from './pages/user/UserDashboard';
import UserReferrals from './pages/user/UserReferrals';
import UserTeam from './pages/user/UserTeam';
import UserTeamTree from './pages/user/UserTeamTree';
import UserMatchingBonus from './pages/user/UserMatchingBonus';
import UserRewards from './pages/user/UserRewards';
import UserPackage from './pages/user/UserPackage';
import UserDeposit from './pages/user/UserDeposit';
import UserProducts from './pages/user/UserProducts';
import UserOrders from './pages/user/UserOrders';
import UserTransactions from './pages/user/UserTransactions';
import UserP2P from './pages/user/UserP2P';
import UserProfile from './pages/user/UserProfile';
import UserWallets from './pages/user/UserWallets';
import IncomeReport from './pages/user/IncomeReport';
import WithdrawPage from './pages/user/WithdrawPage';
import AwardsPage from './pages/user/AwardsPage';
import MatchingTracker from './pages/user/MatchingTracker';
import BinaryTreeUser from './pages/user/BinaryTreeUser';
import ProtectedUserRoute from './components/ProtectedUserRoute';

// Referral Link Handler Component
function ReferralLinkHandler() {
  const { username, position } = useParams();
  
  // Redirect to signup with referral parameters
  return <Navigate to={`/signup?ref=${username}&pos=${position}`} replace />;
}

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
                  path="/admin/user-details/:username"
                  element={
                    <ProtectedAdminRoute>
                      <UserDetailPage />
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
                  path="/admin/deposits"
                  element={
                    <ProtectedAdminRoute>
                      <DepositsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedAdminRoute>
                      <ProductsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/package-orders"
                  element={
                    <ProtectedAdminRoute>
                      <PackageOrdersPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/bank-details"
                  element={
                    <ProtectedAdminRoute>
                      <BankDetailsPage />
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
                <Route
                  path="/admin/wallets-management"
                  element={
                    <ProtectedAdminRoute>
                      <WalletsManagementPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/withdrawals"
                  element={
                    <ProtectedAdminRoute>
                      <WithdrawalsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/withdrawal-settings"
                  element={
                    <ProtectedAdminRoute>
                      <WithdrawalSettingsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/award-claims"
                  element={
                    <ProtectedAdminRoute>
                      <AwardClaimsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/bonus-reports"
                  element={
                    <ProtectedAdminRoute>
                      <BonusReportsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/achievements"
                  element={
                    <ProtectedAdminRoute>
                      <AchievementsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/binary-tree"
                  element={
                    <ProtectedAdminRoute>
                      <BinaryTreePage />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Referral Link Route - Must be before User Panel Routes */}
                <Route path="/:username/:position" element={<ReferralLinkHandler />} />

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
                  path="/account/team-tree"
                  element={
                    <ProtectedUserRoute>
                      <UserTeamTree />
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
                  path="/account/package"
                  element={
                    <ProtectedUserRoute>
                      <UserPackage />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/deposit"
                  element={
                    <ProtectedUserRoute>
                      <UserDeposit />
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
                <Route
                  path="/account/wallets"
                  element={
                    <ProtectedUserRoute>
                      <UserWallets />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/income-report"
                  element={
                    <ProtectedUserRoute>
                      <IncomeReport />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/withdraw"
                  element={
                    <ProtectedUserRoute>
                      <WithdrawPage />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/awards"
                  element={
                    <ProtectedUserRoute>
                      <AwardsPage />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/matching-tracker"
                  element={
                    <ProtectedUserRoute>
                      <MatchingTracker />
                    </ProtectedUserRoute>
                  }
                />
                <Route
                  path="/account/binary-tree"
                  element={
                    <ProtectedUserRoute>
                      <BinaryTreeUser />
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
