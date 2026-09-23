import React, { useState, useEffect } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { FaSearch, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { productAPI, packageOrderAPI, packageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserProducts = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderingProduct, setOrderingProduct] = useState(null);

  // Fetch products and user orders from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all available products
        const productsResponse = await productAPI.getAll(true);
        console.log('Products API Response:', productsResponse);
        
        // Fetch user's package orders
        const ordersResponse = await packageOrderAPI.getUserOrders(user.username);
        console.log('User Orders Response:', ordersResponse);
        
        // Fetch user's approved packages
        const packagesResponse = await packageAPI.getUserPackage(user.username);
        console.log('User Packages Response:', packagesResponse);
        
        const orders = ordersResponse.orders || [];
        const packages = Array.isArray(packagesResponse.package) ? packagesResponse.package : (packagesResponse.package ? [packagesResponse.package] : []);
        
        // Filter approved packages only
        const approvedPackages = packages.filter(pkg => pkg.status === 'approved');
        setUserPackages(approvedPackages);
        setUserOrders(orders);
        
        // Count how many times each product was ordered
        const productOrderCounts = {};
        orders.forEach(order => {
          productOrderCounts[order.product_id] = (productOrderCounts[order.product_id] || 0) + 1;
        });
        console.log('Product Order Counts:', productOrderCounts);
        
        // Add order count to each product
        const productsWithOrderStatus = (productsResponse.products || []).map(product => ({
          ...product,
          orderCount: productOrderCounts[product.id] || 0,
          orders: orders.filter(order => order.product_id === product.id)
        }));
        
        setProducts(productsWithOrderStatus);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  // Handle product order
  const handleOrderProduct = async (product) => {
    if (!user?.username) {
      alert('Please log in to order products');
      return;
    }

    // Check if user has approved packages
    if (userPackages.length === 0) {
      alert('You need to have an approved package to order products. Please make a deposit first.');
      return;
    }

    // Find a package that hasn't been used yet
    const usedPackageIds = userOrders.map(order => order.package_id);
    const availablePackage = userPackages.find(pkg => !usedPackageIds.includes(pkg.id));

    if (!availablePackage) {
      alert('All your packages have been used. Please enroll in a new package to order more products.');
      return;
    }

    // Confirm order
    const confirmOrder = window.confirm(
      `Order ${product.name}?\n\nThis will use Package ID: ${availablePackage.id}\nYou have ${userPackages.length - usedPackageIds.length} package(s) available.`
    );

    if (!confirmOrder) return;

    try {
      setOrderingProduct(product.id);
      
      const orderData = {
        username: user.username,
        package_id: availablePackage.id,
        product_id: product.id
      };

      const response = await packageOrderAPI.create(orderData);
      
      if (response.success) {
        alert(`✅ Order placed successfully!\n\nOrder ID: ${response.order.order_id}\nProduct: ${product.name}\nStatus: Placed`);
        
        // Refresh the page data
        window.location.reload();
      } else {
        alert(`Failed to place order: ${response.message}`);
      }
    } catch (err) {
      console.error('Order error:', err);
      alert(`Failed to place order: ${err.message}`);
    } finally {
      setOrderingProduct(null);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-3xl text-blue-500" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-gray-600 mt-1">Browse and purchase available products</p>
            </div>
            {userPackages.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Available Packages</p>
                <p className="text-2xl font-bold text-green-600">
                  {userPackages.length - userOrders.map(o => o.package_id).filter((v, i, a) => a.indexOf(v) === i).length}
                </p>
              </div>
            )}
          </div>
          {userPackages.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ You need to have an approved package to order products. Please make a deposit first.
              </p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative"
              >
                {/* Order Count Badge */}
                {product.orderCount > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
                      <FaShoppingCart className="text-xs" />
                      Ordered {product.orderCount}x
                    </span>
                  </div>
                )}
                
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={`https://srikaruda.shop${product.image_path}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Order History Info */}
                  {product.orderCount > 0 && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-800 font-medium mb-1">
                        📦 You've ordered this {product.orderCount} time{product.orderCount > 1 ? 's' : ''}
                      </p>
                      {product.orders && product.orders.length > 0 && (
                        <div className="text-xs text-blue-700">
                          Latest: Order #{product.orders[0].order_id} - 
                          <span className="capitalize ml-1 font-semibold">
                            {product.orders[0].status}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleOrderProduct(product)}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.is_available && orderingProduct !== product.id
                          ? 'bg-pink-500 text-white hover:bg-pink-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!product.is_available || orderingProduct === product.id}
                      title={
                        !product.is_available 
                          ? 'Product is not available' 
                          : product.orderCount > 0
                          ? 'Order again from a new package'
                          : 'Select this product'
                      }
                    >
                      {orderingProduct === product.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Ordering...
                        </span>
                      ) : product.is_available ? (
                        product.orderCount > 0 ? 'Order Again' : 'Select Product'
                      ) : (
                        'Unavailable'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No products found matching your search' : 'No products available'}
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Shopping Information</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
            <li>All products come with quality guarantee</li>
            <li>Free delivery on orders above ₹5000</li>
            <li>Easy returns within 7 days</li>
            <li>24/7 customer support available</li>
          </ul>
        </div>
      </div>
    </UserPanelLayout>
  );
};

export default UserProducts;
