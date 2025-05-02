import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Tạo file CSS cho HomePage

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        {/* Thay bằng ảnh banner đẹp sau */}
        <img src="https://via.placeholder.com/1200x400.png?text=Hero+Banner+Thoi+Trang+Cong+So" alt="Thời trang công sở banner" />
        <div className="hero-content">
          <h1>Phong Cách Chuyên Nghiệp, Tự Tin Tỏa Sáng</h1>
          <p>Khám phá bộ sưu tập mới nhất dành cho quý công sở.</p>
          <Link to="/products" className="cta-button">Xem Sản Phẩm</Link>
        </div>
      </section>

      <section className="featured-categories container">
        <h2>Danh Mục Nổi Bật</h2>
        {/* Thêm các danh mục hoặc sản phẩm nổi bật ở đây sau */}
        <p>Áo sơ mi | Quần tây | Chân váy | Đầm liền | Vest/Blazer</p>
      </section>
      {/* Thêm các section khác nếu muốn */}
    </div>
  );
}

export default HomePage;