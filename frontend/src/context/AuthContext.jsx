import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // Sẽ dùng sau này nếu cần fetch user info khi có token

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Lưu thông tin user (object)
  const [token, setToken] = useState(localStorage.getItem('token')); // Lấy token từ localStorage khi tải lại
  const [loading, setLoading] = useState(true); // Để xử lý việc kiểm tra token ban đầu

  // Thiết lập axios interceptor để tự động đính kèm token vào header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Có thể thêm logic để fetch user data từ token ở đây nếu cần
      // Ví dụ:
      // const fetchUser = async () => {
      //   try {
      //     const res = await axios.get('http://localhost:3001/api/auth/me'); // API lấy thông tin user từ token
      //     setCurrentUser(res.data.user);
      //   } catch (error) {
      //     console.error("Could not fetch user with token", error);
      //     logout(); // Nếu token không hợp lệ, đăng xuất
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchUser();

      // Tạm thời, nếu có token, ta sẽ giả định user data từ token đã được lưu trước đó hoặc parse từ token
      // Trong thực tế, bạn nên có API /api/auth/me để xác thực token và lấy thông tin user mới nhất
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        try {
          setCurrentUser(JSON.parse(userFromStorage));
        } catch (e) {
          console.error("Error parsing user from storage", e);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false); // Không có token, không cần fetch
    }
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Lưu user data
    setToken(userToken);
    setCurrentUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
    // Có thể cần navigate('/login') ở đây nếu muốn, nhưng thường component tự xử lý
  };

  // Giá trị sẽ được cung cấp cho các component con
  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser && !!token, // Chỉ true khi cả user và token đều có
    login,
    logout,
    loadingAuth: loading // Trạng thái loading của việc xác thực ban đầu
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Chỉ render children khi không còn loading auth ban đầu */}
    </AuthContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};