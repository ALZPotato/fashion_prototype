import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'; // Import Layout chính
import HomePage from './pages/HomePage';         // Import các trang
import ProductListPage from './pages/ProductListPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';       
import VerifyEmailPage from './pages/VerifyEmailPage'; 
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage'; 
import CartPage from './pages/CartPage';
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
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="register" element={<RegisterPage />} /> 
        <Route path="login" element={<LoginPage />} />       
        <Route path="verify-email" element={<VerifyEmailPage />} /> 
        <Route path="profile" element={<ProfilePage />} />
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