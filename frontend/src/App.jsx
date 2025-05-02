import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Import Layout chính
import HomePage from './pages/HomePage';         // Import các trang
import ProductListPage from './pages/ProductListPage';
import NotFoundPage from './pages/NotFoundPage';
// Import các trang khác sau này (ProductDetailPage, CartPage, CheckoutPage,...)

import './App.css'; // Giữ lại CSS global nếu cần

function App() {
  return (
    <Routes>
      {/* Route sử dụng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Các trang con của MainLayout */}
        <Route index element={<HomePage />} /> {/* index=true nghĩa là trang mặc định cho path="/" */}
        <Route path="products" element={<ProductListPage />} />
        {/* <Route path="product/:id" element={<ProductDetailPage />} /> */} {/* Route cho trang chi tiết sp */}
        {/* <Route path="cart" element={<CartPage />} /> */}
        {/* <Route path="checkout" element={<CheckoutPage />} /> */}
        {/* ... Thêm các routes khác bên trong MainLayout */}

        {/* Route bắt lỗi 404 phải nằm cuối cùng bên trong layout hoặc ngoài layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Có thể có các route không dùng MainLayout ở đây (ví dụ: trang admin) */}
      {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
    </Routes>
  );
}

export default App;