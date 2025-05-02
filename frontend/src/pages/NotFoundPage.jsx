import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Không Tìm Thấy Trang</h1>
      <p>Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/">Quay về Trang Chủ</Link>
    </div>
  );
}

export default NotFoundPage;