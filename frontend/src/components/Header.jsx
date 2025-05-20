import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth(); // << Thêm loadingAuth
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nếu đang trong quá trình xác thực ban đầu, có thể hiển thị trạng thái loading hoặc không hiển thị gì
  if (loadingAuth) {
    return (
        <header className="app-header">
            <div className="container header-container">
                <Link to="/" className="logo">Thời Trang Công Sở XYZ</Link>
                <div className="header-actions">Đang tải...</div>
            </div>
        </header>
    );
  }

  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo">
          Thời Trang Công Sở XYZ
        </Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/products">Sản Phẩm</Link></li>
            {isAuthenticated && currentUser && <li><Link to="/profile">Tài Khoản</Link></li>}
          </ul>
        </nav>
        <div className="header-actions">
          {isAuthenticated && currentUser ? ( // Kiểm tra cả currentUser để chắc chắn có thông tin
            <>
              <span style={{ marginRight: '10px', color: 'var(--color-text-primary)' }}>
                Chào, {currentUser.fullName || currentUser.email}!
              </span>
              <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Đăng Nhập</Link>
              <Link to="/register" className="auth-link">Đăng Ký</Link>
            </>
          )}
          <Link to="/cart" className="cart-icon-link">
            <span className="cart-icon-display">🛒</span> {/* Bạn có thể thay bằng icon SVG/font sau */}
            {itemCount > 0 && ( // Chỉ hiển thị số lượng nếu itemCount > 0
              <span className="cart-count-badge">{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;