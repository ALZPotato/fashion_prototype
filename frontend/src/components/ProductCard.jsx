import React from 'react';
import { Link } from 'react-router-dom'; // Link đến trang chi tiết sau này
import './ProductCard.css'; // Tạo file CSS

function ProductCard({ product }) { // Nhận prop là thông tin 1 sản phẩm
  if (!product) {
    return null; // Tránh lỗi nếu product không tồn tại
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}> {/* Link tới trang chi tiết */}
        <img
          src={product.image_url || "https://via.placeholder.com/400x300.png?text=Image+Not+Found"} // Ảnh mặc định nếu không có URL
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300.png?text=Image+Error" }}
        />
      </Link>
      <div className="product-info">
        <h3 className="product-name">
           <Link to={`/product/${product.id}`}>{product.name || 'Tên sản phẩm'}</Link>
        </h3>
        <p className="product-price">
          {product.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) : 'Liên hệ'}
        </p>
        {/* Có thể thêm nút "Thêm vào giỏ" ở đây */}
        {/* <button className="add-to-cart-button">Thêm vào giỏ</button> */}
      </div>
    </div>
  );
}

export default ProductCard;