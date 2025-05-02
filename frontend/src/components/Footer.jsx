import React from 'react';
import './Footer.css'; // Tạo file CSS cho Footer

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h4>Về Chúng Tôi</h4>
          <ul>
            <li><a href="#">Giới thiệu XYZ</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Hệ thống cửa hàng</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Hỗ Trợ Khách Hàng</h4>
          <ul>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Kết nối với chúng tôi</h4>
          {/* Thêm icon mạng xã hội */}
          <span>FB</span> <span>IG</span> <span>YT</span>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Thời Trang Công Sở. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;