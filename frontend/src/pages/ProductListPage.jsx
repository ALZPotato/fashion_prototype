import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination'; // <<< Import Pagination
import './ProductListPage.css';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State cho phân trang ---
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(0);   // Tổng số trang
  const [totalItems, setTotalItems] = useState(0);   // Tổng số sản phẩm
  const itemsPerPage = 12; // Số sản phẩm mỗi trang (phải khớp hoặc nhỏ hơn limit backend)

  // --- useEffect để fetch data khi currentPage thay đổi ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Bắt đầu loading cho mỗi lần chuyển trang
        setError(null);
        // Thêm params page và limit vào API call
        const response = await axios.get(`http://localhost:3001/api/products?page=${currentPage}&limit=${itemsPerPage}`);

        // Cập nhật state từ dữ liệu API trả về
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setCurrentPage(response.data.currentPage); // Đảm bảo currentPage đồng bộ

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchProducts();
    // Cuộn lên đầu trang mỗi khi chuyển trang (UX)
    window.scrollTo(0, 0);

    // Dependency array bao gồm currentPage để useEffect chạy lại khi trang thay đổi
  }, [currentPage]);

  // --- Hàm xử lý khi người dùng nhấn nút phân trang ---
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Cập nhật state trang hiện tại
  };

  // --- Render ---
  if (loading && products.length === 0) return <div className="container loading">Đang tải sản phẩm...</div>; // Chỉ hiển thị loading toàn trang lần đầu
  if (error) return <div className="container error">Lỗi: {error}</div>;

  return (
    <div className="container product-list-page">
      <h1>Sản Phẩm</h1>
      <div className="filter-sort-area">
         <span>Bộ lọc | Sắp xếp ({totalItems} sản phẩm)</span> {/* Hiển thị tổng số sản phẩm */}
      </div>

      {/* Hiển thị loading nhẹ khi chuyển trang */}
      {loading && <div className="loading-overlay">Đang tải trang mới...</div>}

      <div className="product-grid">
        {products.length === 0 && !loading ? ( // Kiểm tra kỹ hơn
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* --- Thêm component Pagination vào đây --- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange} // Truyền hàm xử lý xuống
      />
    </div>
  );
}

export default ProductListPage;