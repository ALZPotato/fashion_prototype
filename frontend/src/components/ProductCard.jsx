import React from 'react';
import { Link } from 'react-router-dom'; // Link đến trang chi tiết sau này
import { useCart } from '../context/CartContext';
import './ProductCard.css'; // Tạo file CSS

function ProductCard({ product }) { // Nhận prop là thông tin 1 sản phẩm
  const { addToCart } = useCart();
  if (!product) {
    return null; // Tránh lỗi nếu product không tồn tại
  }
  
  const handleQuickAddToCart = (e) => {
  e.preventDefault(); // Ngăn Link cha điều hướng nếu nút nằm trong Link
  e.stopPropagation(); // Ngăn sự kiện nổi bọt
  addToCart(product, 1); // << SỬ DỤNG HÀM - Mặc định thêm 1 sản phẩm
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

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
        <button onClick={handleQuickAddToCart} className="quick-add-to-cart-button">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductCard;