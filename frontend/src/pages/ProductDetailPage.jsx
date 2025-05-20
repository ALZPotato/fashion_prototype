import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate,useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import axios from 'axios';
import './ProductDetailPage.css'; 

function ProductDetailPage() {
  const { id } = useParams(); // Lấy product id từ URL (ví dụ: /product/123 -> id là "123")
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State cho số lượng sản phẩm
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(`Error fetching product details for ID ${id}:`, err);
        setError(err.response?.data?.message || "Không thể tải thông tin sản phẩm. Sản phẩm có thể không tồn tại hoặc đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Chỉ fetch khi có id
      fetchProductDetails();
    }
  }, [id]); // Dependency array là [id], để useEffect chạy lại mỗi khi id trên URL thay đổi

  const handleQuantityChange = (amount) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + amount)); // Đảm bảo số lượng không nhỏ hơn 1
  };

    const handleAddToCart = () => {
    if (!isAuthenticated) { // << KIỂM TRA Ở ĐÂY TRƯỚC KHI GỌI CONTEXT
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
        navigate('/login', { state: { from: location } }); // Chuyển hướng và lưu lại trang hiện tại để quay lại sau khi đăng nhập
        return;
    }
    if (product) {
        addToCart(product, quantity); // << SỬ DỤNG HÀM addToCart TỪ CONTEXT
                                    // Truyền vào object product đầy đủ và số lượng
        alert(`${quantity} x "${product.name}" đã được thêm vào giỏ hàng!`);
    }
    };

  if (loading) {
    return <div className="container loading" style={{paddingTop: '30px'}}>Đang tải chi tiết sản phẩm...</div>;
  }

  if (error) {
    return (
      <div className="container error-page-message" style={{paddingTop: '30px'}}>
        <p>Lỗi: {error}</p>
        <Link to="/products">Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  if (!product) { // Nếu không loading, không error, mà product vẫn null (ví dụ API trả về 404)
    return (
      <div className="container" style={{paddingTop: '30px', textAlign: 'center'}}>
        <p>Sản phẩm không được tìm thấy.</p>
        <Link to="/products">Quay lại danh sách sản phẩm</Link>
      </div>
    );
  }

  // Nếu có sản phẩm, render chi tiết
  return (
    <div className="container product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        {' > '} {/* Sử dụng chuỗi JavaScript chứa dấu > */}
        <Link to="/products">Sản phẩm</Link>
        {' > '} {/* Sử dụng chuỗi JavaScript chứa dấu > */}
        <span>{product.name}</span>
    </div>


      <div className="product-detail-content">
        <div className="product-image-gallery">
          <img
            src={product.image_url || "https://via.placeholder.com/600x600.png?text=Product+Image"}
            alt={product.name}
            className="main-product-image"
            onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/600x600.png?text=Image+Error" }}
          />
          {/* TODO: Thêm gallery ảnh nhỏ nếu sản phẩm có nhiều ảnh */}
        </div>

        <div className="product-info-main">
          <h1 className="pdp-product-name">{product.name}</h1>
          <p className="pdp-product-price">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>

          {/* Phần chọn Size, Màu sắc (tạm thời để trống hoặc giao diện mẫu) */}
          <div className="product-options">
            <div className="option-group">
              <label htmlFor="size">Kích thước:</label>
              <select id="size" name="size" className="option-select">
                <option value="">Chọn size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
            {/* Thêm option màu nếu cần */}
          </div>

          <div className="product-quantity">
            <label htmlFor="quantity-pdp">Số lượng:</label>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              {/* <input type="number" id="quantity-pdp" value={quantity} readOnly /> Hoặc chỉ hiển thị span */}
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <button className="add-to-cart-button-detail" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>

          <div className="product-description-detail">
            <h2>Mô tả sản phẩm</h2>
            <p>{product.description || "Hiện chưa có mô tả chi tiết cho sản phẩm này."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;