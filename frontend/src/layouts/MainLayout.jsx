import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet là nơi nội dung của route con sẽ hiển thị
import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer
import './MainLayout.css'; // Tạo file CSS riêng cho layout nếu cần

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {/* Nội dung của các trang con sẽ được render ở đây */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;