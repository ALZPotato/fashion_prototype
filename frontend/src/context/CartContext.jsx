import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// 1. Tạo Context
const CartContext = createContext(null);

// 2. Tạo Provider Component
export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('shoppingCart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
      return [];
    }
  });

  // useEffect để lưu cartItems vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
    }
  }, [cartItems]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantityToAdd = 1) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return; 
    }
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Nếu sản phẩm đã có, cập nhật số lượng
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantityToAdd;
        return updatedItems;
      } else {
        // Nếu sản phẩm chưa có, thêm mới
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
    // console.log(`${quantityToAdd} x "${product.name}" đã được thêm vào giỏ.`); // Có thể thêm thông báo
  };

  // Hàm cập nhật số lượng sản phẩm trong giỏ
  const updateQuantity = (productId, newQuantity) => {
    const quantityNum = parseInt(newQuantity, 10);
    // Chỉ cập nhật nếu số lượng mới là số hợp lệ và >= 1
    if (!isNaN(quantityNum) && quantityNum >= 1) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: quantityNum } : item
        )
      );
    } else if (!isNaN(quantityNum) && quantityNum < 1) {
      // Nếu người dùng cố tình đặt số lượng < 1, có thể coi như xóa sản phẩm
      removeFromCart(productId);
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính toán tổng số lượng item (không phải số loại sản phẩm)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Tính toán tổng giá trị giỏ hàng
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Giá trị mà Context sẽ cung cấp
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount, // Tổng số lượng của tất cả các món hàng
    cartTotal, // Tổng tiền
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 3. Tạo custom hook để dễ dàng sử dụng Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart phải được sử dụng bên trong một CartProvider');
  }
  return context;
};