// src/contexts/CartContext.js
import { createContext, useState, useEffect, useCallback } from 'react';
// import { useProductContext } from './ProductContext';

export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
});

export function CartProvider({ children }) {
  const isBrowser = typeof window !== 'undefined';
  // const { products } = useProductContext(); 
 const [quantity,setQuantity]=useState(1); // Default quantity for cart items

 

  // Cart functionality
  const [cartItems, setCartItems] = useState(() => {
    if (isBrowser) {
      const storedCartItems = localStorage.getItem('cartItems');
      return storedCartItems ? JSON.parse(storedCartItems) : [];
    }
    return [];
  });

  // Wishlist functionality
  const [wishlistItems, setWishlistItems] = useState(() => {
    if (isBrowser) {
      const storedWishlistItems = localStorage.getItem('wishlistItems');
      return storedWishlistItems ? JSON.parse(storedWishlistItems) : [];
    }
    return [];
  });

  // Cart methods
  const addToCart = (item) => {
    // console.log(item, 'item')
    const isItemInCart = cartItems.find(cartItem => cartItem.variationId === item.variationId);
    if (!isItemInCart) {
      setCartItems(prev => [...prev, { ...item,quantity }]);
    }
  };

  const removeFromCart = (item) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.variationId !== item.variationId));
    setQuantity(1); 
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.offer_price || item.regular_price || item.price || 0);
    return total + (price * (item.quantity || 1));
    }, 0);
  };

  const IncrementQuantity = useCallback((variationId) => {
    setCartItems(prev => prev.map(item => 
      item.variationId === variationId 
        ? {...item, quantity: item.quantity + 1} 
        : item
    ));
  }, []);
  
  const DecrementQuantity = useCallback((variationId) => {
    setCartItems(prev => prev.map(item => 
      item.variationId === variationId && item.quantity > 1
        ? {...item, quantity: item.quantity - 1} 
        : item
    ));
  }, []);
  // Wishlist methods
  const addToWishlist = (item) => {
    const isItemInWishlist = wishlistItems.find(wishlistItem => wishlistItem.variationId === item.variationId);
    if (!isItemInWishlist) {
      setWishlistItems(prev => [...prev, { ...item }]);
    }
  };

  const removeFromWishlist = (item) => {
    setWishlistItems(prev => prev.filter(wishlistItem => wishlistItem.variationId !== item.variationId));
  };

  const isInWishlist = (itemId) => {
    // console.log(itemId, 'itemId')
    return wishlistItems.some(item => item.variationId === itemId);
  };

  // Sync with localStorage
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        IncrementQuantity,
        DecrementQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        quantity,
        setQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}