import { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('karuda_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('karuda_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('karuda_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('karuda_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('karuda_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('karuda_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
  };

  const buyNow = (product) => {
    // Store the buy now item separately for direct checkout
    const buyNowItem = {
      ...product,
      quantity: product.quantity || 1,
      type: 'product'
    };
    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    return buyNowItem;
  };

  const buyPackageNow = (packageData) => {
    // Store the buy now package separately for direct checkout
    const buyNowItem = {
      ...packageData,
      quantity: packageData.quantity || 1,
      type: 'package'
    };
    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    return buyNowItem;
  };

  const addPackageToCart = (packageData) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === packageData.id && item.type === 'package');
      if (existing) {
        return prev.map(item =>
          item.id === packageData.id && item.type === 'package'
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...packageData, quantity: packageData.quantity || 1, type: 'package' }];
    });
  };

  const clearBuyNow = () => {
    localStorage.removeItem('buyNowItem');
  };

  const getBuyNowItem = () => {
    const saved = localStorage.getItem('buyNowItem');
    return saved ? JSON.parse(saved) : null;
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: getCartTotal(),
      date: new Date().toISOString(),
      status: 'Processing',
      ...orderData,
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const value = {
    cart,
    wishlist,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    toggleWishlist,
    isInWishlist,
    placeOrder,
    clearCart,
    buyNow,
    buyPackageNow,
    addPackageToCart,
    clearBuyNow,
    getBuyNowItem,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};
