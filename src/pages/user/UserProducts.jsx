import React, { useState } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

const UserProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock products (in production, fetch from backend/context)
  const products = [
    {
      id: 1,
      name: 'Santhana Kinnam',
      category: 'Groceries',
      price: 12000,
      stock: 50,
      image: '/images/products/santhana-kinnam.jpg',
      description: 'Premium quality Santhana Kinnam',
    },
    {
      id: 2,
      name: 'Maligai Porulgal',
      category: 'Groceries',
      price: 8000,
      stock: 100,
      image: '/images/products/maligai.jpg',
      description: 'Essential grocery items package',
    },
    {
      id: 3,
      name: 'Saree',
      category: 'Fashion',
      price: 5000,
      stock: 30,
      image: '/images/products/saree.jpg',
      description: 'Traditional silk saree',
    },
    {
      id: 4,
      name: 'Induction Stove',
      category: 'Appliances',
      price: 3500,
      stock: 25,
      image: '/images/products/induction.jpg',
      description: 'Modern induction cooking stove',
    },
  ];

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
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-gray-600 mt-1">Browse and purchase available products</p>
            </div>
          </div>
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 20
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-pink-600">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.stock > 0
                          ? 'bg-pink-500 text-white hover:bg-pink-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
              <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
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
