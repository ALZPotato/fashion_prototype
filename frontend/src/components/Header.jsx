import React from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để điều hướng thay vì thẻ <a>
import './Header.css'; // Tạo file CSS cho Header

function Header() {
  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo">
          {/* Có thể thay bằng logo thật sau */}
          Thời Trang Công Sở
        </Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Trang Chủ</Link></li>
            <li><Link to="/products">Sản Phẩm</Link></li>
            {/* Thêm các link khác sau: Giới thiệu, Liên hệ,... */}
          </ul>
        </nav>
        <div className="header-actions">
          {/* Thêm icon tìm kiếm, tài khoản, giỏ hàng sau */}
          <span>🔍</span> {/* Icon tạm */}
          <span>👤</span> {/* Icon tạm */}
          <span>🛒 (0)</span> {/* Icon tạm */}
        </div>
      </div>
    </header>
  );
}

export default Header;