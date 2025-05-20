import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'; // Để bảo vệ route

function ProfilePage() {
  const { isAuthenticated, currentUser, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Đang tải thông tin người dùng...</div>; // Trạng thái chờ khi auth đang load
  }

  // Nếu chưa xác thực, chuyển về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container profile-page" style={{ marginTop: '30px' }}>
      <h1>Trang Cá Nhân</h1>
      {currentUser ? (
        <div>
          <p><strong>Họ và Tên:</strong> {currentUser.fullName}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Vai trò:</strong> {currentUser.role}</p>
          {/* Thêm các thông tin khác hoặc chức năng chỉnh sửa sau */}
        </div>
      ) : (
        <p>Không thể tải thông tin người dùng.</p>
      )}
    </div>
  );
}

export default ProfilePage;