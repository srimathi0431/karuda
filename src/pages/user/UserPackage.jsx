import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useAuth } from '../../context/AuthContext';
import { packageAPI, productAPI, packageOrderAPI } from '../../services/api';
import { FaBox, FaCheckCircle, FaClock, FaTimesCircle, FaGift } from 'react-icons/fa';
import '../../styles/UserPackage.css';

const UserPackage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);
  const [packageOrders, setPackageOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, [user?.username]);

  const fetchData = async () => {
    if (!user?.username) return;
    
    try {
      setLoading(true);
      const [pkgResponse, prodResponse, ordersResponse] = await Promise.all([
        packageAPI.getUserPackage(user.username),
        productAPI.getAll(true),
        packageOrderAPI.getUserOrders(user.username)
      ]);
      
      const packages = Array.isArray(pkgResponse.package) ? pkgResponse.package : (pkgResponse.package ? [pkgResponse.package] : []);
      const approvedPackages = packages.filter(pkg => pkg.status === 'approved');
      
      // Get the first approved package for display
      setPackageData(packages.length > 0 ? packages[0] : null);
      setProducts(prodResponse.products || []);
      setPackageOrders(ordersResponse.orders || []);
    } catch (error) {
      console.error('Failed to load package data:', error);
      showMessage('error', 'Failed to load package data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handlePurchasePackage = () => {
    navigate('/account/deposit');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedProduct || !packageData) return;
    
    try {
      setSubmitting(true);
      const response = await packageOrderAPI.create({
        username: user.username,
        package_id: packageData.id,
        product_id: selectedProduct.id
      });
      
      if (response.success) {
        showMessage('success', 'Order placed successfully!');
        setShowConfirmModal(false);
        setTimeout(() => navigate('/account/orders'), 2000);
      } else {
        showMessage('error', response.message || 'Failed to place order');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="package-loading">
          <div className="loading-spinner"></div>
          <p>Loading package...</p>
        </div>
      </UserPanelLayout>
    );
  }

  // No Package State
  if (!packageData) {
    return (
      <UserPanelLayout>
        <div className="package-container">
          {message.text && (
            <div className={`message-toast ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="package-empty-state">
            <FaBox className="empty-icon" />
            <h1>Purchase Package</h1>
            <p className="subtitle">Activate your account</p>
            
            <div className="package-info-card">
              <h2 className="package-price">Package Price: ₹6000</h2>
              
              <div className="package-benefits">
                <h3>Benefits:</h3>
                <ul>
                  <li><FaCheckCircle /> Choose 1 premium product</li>
                  <li><FaCheckCircle /> Earn referral commissions</li>
                  <li><FaCheckCircle /> Referral rewards</li>
                  <li><FaCheckCircle /> Free delivery</li>
                </ul>
              </div>
              
              <button onClick={handlePurchasePackage} className="btn-purchase">
                Purchase Package
              </button>
            </div>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  // Pending Approval State
  if (packageData.status === 'pending') {
    return (
      <UserPanelLayout>
        <div className="package-container">
          {message.text && (
            <div className={`message-toast ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="package-status-card pending">
            <FaClock className="status-icon" />
            <h1>Package Status</h1>
            
            <div className="status-details">
              <div className="detail-row">
                <span>Amount Paid:</span>
                <strong>₹{packageData.package_amount}</strong>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span className="status-badge pending">Pending Approval</span>
              </div>
              <div className="detail-row">
                <span>Submitted:</span>
                <span>{new Date(packageData.submitted_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button onClick={() => setShowReceiptModal(true)} className="btn-view-receipt">
              View Receipt
            </button>
            
            <p className="waiting-text">Waiting for admin approval...</p>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  // Rejected State
  if (packageData.status === 'rejected') {
    return (
      <UserPanelLayout>
        <div className="package-container">
          {message.text && (
            <div className={`message-toast ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="package-status-card rejected">
            <FaTimesCircle className="status-icon" />
            <h1>Package Rejected</h1>
            
            <div className="status-details">
              <div className="detail-row">
                <span>Amount:</span>
                <strong>₹{packageData.package_amount}</strong>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span className="status-badge rejected">Rejected</span>
              </div>
              {packageData.admin_notes && (
                <div className="detail-row full-width">
                  <span>Admin Notes:</span>
                  <p className="admin-notes">{packageData.admin_notes}</p>
                </div>
              )}
            </div>
            
            <button onClick={handlePurchasePackage} className="btn-purchase">
              Submit New Deposit
            </button>
          </div>
        </div>
      </UserPanelLayout>
    );
  }

  // Approved - Check if product has been ordered
  if (packageData.status === 'approved') {
    // Check if this package has an order
    const packageOrder = packageOrders.find(order => order.package_id === packageData.id);
    
    if (!packageOrder) {
      // No product selected yet - show product selection
      return (
        <UserPanelLayout>
          <div className="package-container">
            {message.text && (
              <div className={`message-toast ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="package-activated">
              <FaGift className="activated-icon" />
              <h1>Package Activated!</h1>
              <p className="subtitle">Choose Your Product</p>
              
              <div className="products-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="product-image">
                      <img 
                        src={`https://srikaruda.shop${product.image_path}`}
                        alt={product.name}
                        onError={(e) => e.target.src = '/images/placeholder.png'}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <span className="product-category">{product.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && selectedProduct && (
              <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>Confirm Product Selection</h3>
                  <div className="confirm-product">
                    <img 
                      src={`https://srikaruda.shop${selectedProduct.image_path}`}
                      alt={selectedProduct.name}
                    />
                    <div>
                      <h4>{selectedProduct.name}</h4>
                      <p>{selectedProduct.description}</p>
                    </div>
                  </div>
                  <p className="confirm-text">
                    You can only select one product per package. Are you sure you want to choose this product?
                  </p>
                  <div className="modal-actions">
                    <button onClick={() => setShowConfirmModal(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleConfirmOrder} className="btn-primary" disabled={submitting}>
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </UserPanelLayout>
      );
    } else {
      // Product has been ordered - show order status
      const getStatusText = (status) => {
        const statusMap = {
          'placed': 'Order Placed',
          'confirmed': 'Order Confirmed',
          'shipped': 'Product is on the way',
          'delivered': 'Delivered'
        };
        return statusMap[status] || status;
      };

      const getStatusIcon = (status) => {
        if (status === 'delivered') return <FaCheckCircle className="complete-icon" />;
        if (status === 'shipped') return <FaBox className="shipping-icon" />;
        return <FaClock className="pending-icon" />;
      };

      return (
        <UserPanelLayout>
          <div className="package-container">
            {message.text && (
              <div className={`message-toast ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="package-complete">
              {getStatusIcon(packageOrder.status)}
              <h1>Package Details</h1>
              
              <div className="status-details">
                <div className="detail-row">
                  <span>Status:</span>
                  <span className="status-badge active">Active</span>
                </div>
                <div className="detail-row">
                  <span>Activated:</span>
                  <span>{new Date(packageData.reviewed_at || packageData.approved_at).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Package Amount:</span>
                  <strong>₹{packageData.package_amount}</strong>
                </div>
                
                <div className="divider"></div>
                
                <div className="detail-row">
                  <span>Product:</span>
                  <strong>{packageOrder.product_name}</strong>
                </div>
                <div className="detail-row">
                  <span>Order ID:</span>
                  <strong>{packageOrder.order_id}</strong>
                </div>
                <div className="detail-row">
                  <span>Order Status:</span>
                  <span className={`status-badge ${packageOrder.status}`}>
                    {getStatusText(packageOrder.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Ordered On:</span>
                  <span>{new Date(packageOrder.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button onClick={() => navigate('/account/orders')} className="btn-view-orders">
                View All Orders
              </button>
            </div>
          </div>

          {/* Receipt Modal */}
          {showReceiptModal && packageData.payment_receipt && (
            <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
              <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Payment Receipt</h3>
                <img src={packageData.payment_receipt} alt="Receipt" className="receipt-image" />
                <button onClick={() => setShowReceiptModal(false)} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          )}
        </UserPanelLayout>
      );
    }
  }
};

export default UserPackage;
