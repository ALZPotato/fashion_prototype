// frontend/src/pages/ProductListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import './ProductListPage.css';

// --- Component Filters (Giữ nguyên như bạn đã có hoặc như hướng dẫn trước) ---
const Filters = ({ initialFilters, onApplyFilters, onResetFilters }) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'newest');

  // Cập nhật state nội bộ của Filters khi initialFilters từ URL thay đổi
  useEffect(() => {
    setSearchTerm(initialFilters.search || '');
    setMinPrice(initialFilters.minPrice || '');
    setMaxPrice(initialFilters.maxPrice || '');
    setSortBy(initialFilters.sortBy || 'newest');
  }, [initialFilters]); // Chỉ chạy khi initialFilters (từ props) thay đổi

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters({
      search: searchTerm.trim(), minPrice, maxPrice, sortBy,
    });
  };

  const handleReset = () => {
    // Không cần setState ở đây nữa, cha sẽ cập nhật URL và initialFilters sẽ thay đổi
    onResetFilters();
  };

  return (
    <div className="filters-sidebar">
      <h4>Tìm kiếm & Lọc</h4>
      <form onSubmit={handleApply}>
        {/* ... (Các input và select giữ nguyên) ... */}
         <div className="filter-group">
          <label htmlFor="search">Tên sản phẩm</label>
          <input type="text" id="search" placeholder="Nhập tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group price-range-group">
          <label>Khoảng giá</label>
          <div className="price-inputs">
            <input type="number" placeholder="Từ (VNĐ)" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0"/>
            <span>-</span>
            <input type="number" placeholder="Đến (VNĐ)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"/>
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="sortBy">Sắp xếp theo</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Mới nhất (Mặc định)</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="name_asc">Tên: A-Z</option>
            <option value="name_desc">Tên: Z-A</option>
          </select>
        </div>
        <div className="filter-actions">
          <button type="submit" className="apply-filters-btn">Áp dụng</button>
          <button type="button" onClick={handleReset} className="reset-filters-btn">Đặt lại</button>
        </div>
      </form>
    </div>
  );
};


// --- Component ProductListPage ---
function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate(); // Có thể không cần navigate nữa nếu chỉ dùng setSearchParams

  const [currentPage, setCurrentPage] = useState(1); // Sẽ được cập nhật từ searchParams hoặc API response
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Lấy các giá trị filter hiện tại từ searchParams để truyền xuống Filters component
  // Dùng React.useMemo để chỉ tính toán lại khi searchParams thay đổi
  const currentFiltersFromUrl = React.useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return {
      search: params.get('search') || '',
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      sortBy: params.get('sortBy') || 'newest',
      // category: params.get('category') || '',
    };
  }, [searchParams]);


  const fetchProducts = useCallback(async (paramsToFetch) => { // paramsToFetch là một URLSearchParams object
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching with params:", paramsToFetch.toString()); // Debug
      const response = await axios.get(`http://localhost:3001/api/products?${paramsToFetch.toString()}`);

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setCurrentPage(response.data.currentPage);
      // Không cần setActiveFilters ở đây nữa, vì nó được tính từ searchParams qua useMemo

    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
      setProducts([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, []); // Dependency rỗng vì hàm này không phụ thuộc vào state bên ngoài (nó nhận params)

  // useEffect chính để fetch dữ liệu khi searchParams (URL) thay đổi
  useEffect(() => {
    console.log("ProductList useEffect triggered by searchParams change:", searchParams.toString()); // Debug
    const params = new URLSearchParams(searchParams);

    // Đảm bảo page và limit luôn có mặt
    if (!params.has('page')) {
      params.set('page', '1');
    }
    if (!params.has('limit')) {
      params.set('limit', itemsPerPage.toString());
    }
    // Đồng bộ URL nếu page hoặc limit bị thiếu (tùy chọn)
    // if (searchParams.toString() !== params.toString()) {
    //   setSearchParams(params, { replace: true });
    //   return; // Tránh gọi fetchProducts 2 lần nếu URL vừa được cập nhật
    // }

    fetchProducts(params);
    window.scrollTo(0,0);
  }, [searchParams, fetchProducts, itemsPerPage]); // Chỉ phụ thuộc searchParams và fetchProducts


  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    setSearchParams(newParams, { replace: true });
  };

  const handleApplyFilters = (newFilters) => {
    const newParams = new URLSearchParams();
    newParams.set('page', '1'); // Luôn về trang 1 khi lọc mới
    newParams.set('limit', itemsPerPage.toString()); // Luôn thêm limit
    if (newFilters.search) newParams.set('search', newFilters.search);
    if (newFilters.minPrice) newParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) newParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortBy) newParams.set('sortBy', newFilters.sortBy);
    // if (newFilters.category) newParams.set('category', newFilters.category);
    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => { // Đổi tên hàm này cho rõ hơn
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('limit', itemsPerPage.toString());
    newParams.set('sortBy','newest'); // Chỉ giữ lại sortBy mặc định
    setSearchParams(newParams, {replace: true});
  }


  // ----- RENDER -----
  if (loading && products.length === 0) {
    return <div className="container loading" style={{paddingTop: "30px"}}>Đang tải sản phẩm...</div>;
  }
  if (error && products.length === 0) {
    return <div className="container error-page-message" style={{paddingTop: "30px"}}>{error}</div>;
  }

  return (
    <div className="container product-list-page-layout">
      <Filters
        initialFilters={currentFiltersFromUrl} // Truyền giá trị đọc từ URL
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters} // Truyền hàm reset mới
      />

      <div className="product-list-content">
        <h1>Sản Phẩm {totalItems > 0 ? `(${totalItems} kết quả)` : '(Không có kết quả)'}</h1>
        {loading && products.length > 0 && <div className="loading-inline" style={{textAlign: 'center', padding: '20px', color: 'var(--color-accent)'}}>Đang cập nhật...</div>}

        {!loading && products.length === 0 ? (
          <p className="no-products-found">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {totalPages > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}
      </div>
    </div>
  );
}

export default ProductListPage;