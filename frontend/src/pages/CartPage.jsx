import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useCart } from '../context/CartContext';
import './CartPage.css'; // Sẽ tạo file CSS sau

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, itemCount } = useCart();
  const navigate = useNavigate(); // Hook để điều hướng

  const handleProceedToCheckout = () => {
    // TODO: Sau này sẽ điều hướng đến trang Checkout
    // Hiện tại có thể chỉ log hoặc alert
    console.log("Proceeding to checkout with items:", cartItems);
    alert("Chức năng Thanh toán sẽ được phát triển ở giai đoạn sau!");
    // navigate('/checkout'); // Bỏ comment khi có trang checkout
  };

  if (itemCount === 0) {
    return (
      <div className="container cart-page empty-cart" style={{ textAlign: 'center', paddingTop: '50px' }}>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ.</p>
        <Link
          to="/products"
          className="cta-button"
          style={{
            marginTop: '20px',
            display: 'inline-block',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-background)', // Hoặc var(--color-text-primary) tùy màu accent
            padding: '12px 25px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Giỏ Hàng Của Bạn ({itemCount} sản phẩm)</h1>

      <div className="cart-items-list">
        <div className="cart-header-row">
          <div className="cart-header-product">Sản phẩm</div>
          <div className="cart-header-price">Đơn giá</div>
          <div className="cart-header-quantity">Số lượng</div>
          <div className="cart-header-subtotal">Thành tiền</div>
          <div className="cart-header-action">Xóa</div>
        </div>

        {cartItems.map(item => (
          <div key={item.id} className="cart-item-row">
            <div className="cart-item-product">
              <Link to={`/product/${item.id}`} className="cart-item-image-link">
                <img src={item.image_url || "https://via.placeholder.com/80x80.png?text=Img"} alt={item.name} />
              </Link>
              <div className="cart-item-name-desc">
                <Link to={`/product/${item.id}`}>
                  <h3>{item.name}</h3>
                </Link>
                {/* Có thể thêm mô tả ngắn hoặc thuộc tính (size, màu) ở đây nếu có */}
              </div>
            </div>

            <div className="cart-item-price-unit">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
            </div>

            <div className="cart-item-quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                min="1"
                className="quantity-input-cart"
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>

            <div className="cart-item-subtotal-value">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
            </div>

            <div className="cart-item-remove-action">
              <button onClick={() => removeFromCart(item.id)} className="remove-btn-cart">
                × {/* Ký tự X để xóa */}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary-actions">
        <div className="cart-coupon">
          {/* TODO: Thêm ô nhập mã giảm giá sau */}
          {/* <input type="text" placeholder="Nhập mã giảm giá" />
          <button>Áp dụng</button> */}
        </div>
        <div className="cart-total-section">
          <button onClick={clearCart} className="clear-cart-btn" disabled={itemCount === 0}>
            Xóa toàn bộ giỏ hàng
          </button>
          <div className="cart-grand-total">
            <h3>Tổng Cộng:</h3>
            <p className="total-price-value">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}
            </p>
          </div>
          <button onClick={handleProceedToCheckout} className="checkout-btn-cart" disabled={itemCount === 0}>
            Tiến hành Đặt Hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;