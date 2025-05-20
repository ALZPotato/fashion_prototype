import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css'; // Sử dụng chung CSS

// Icon mắt (có thể đặt trong file riêng nếu dùng nhiều)
const EyeIcon = () => <span className="eye-icon">👁️</span>;
const EyeSlashIcon = () => <span className="eye-icon eye-slash">👁️</span>;

function LoginPage() {
  // --- KHAI BÁO STATE CHO FORM DATA ---
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // --- KHAI BÁO STATE CHO LỖI, LOADING, MESSAGE XÁC THỰC, HIỂN THỊ MẬT KHẨU ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State cho việc hiển thị mật khẩu

  // --- LẤY HÀM LOGIN TỪ AUTHCONTEXT VÀ CÁC HOOK KHÁC ---
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure formData để dùng email, password trực tiếp
  const { email, password } = formData;

  // --- HÀM XỬ LÝ THAY ĐỔI INPUT ---
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- HÀM TOGGLE HIỂN THỊ MẬT KHẨU ---
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // --- USEEFFECT ĐỂ XỬ LÝ MESSAGE SAU KHI XÁC THỰC EMAIL ---
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('verified') === 'true') {
      setVerificationMessage('Xác thực email thành công! Vui lòng đăng nhập.');
      // Tùy chọn: Xóa query param khỏi URL
      // navigate('/login', { replace: true });
    }
  }, [location.search, navigate]); // Thêm navigate vào dependency array nếu bạn dùng nó trong effect

  // --- HÀM XỬ LÝ SUBMIT FORM ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerificationMessage(''); // Xóa thông báo cũ khi submit lại

    try {
      // Dùng biến đã destructure: email, password
      const userCredentials = { email, password };
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        userCredentials
      );

      login(response.data.user, response.data.token);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error('Login error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PHẦN JSX ĐỂ RENDER ---
  return (
    <div className="auth-container container">
      <h2>Đăng Nhập</h2>
      {error && <p className="error-message">{error}</p>}
      {verificationMessage && <p className="success-message">{verificationMessage}</p>}
      <form onSubmit={onSubmit} className="auth-form">
        {/* Email - Floating Label */}
        <div className={`form-group floating-label-group ${email ? 'has-value' : ''}`}> {/* SỬ DỤNG BIẾN `email` */}
          <input
            type="email"
            id="email"
            name="email"
            value={email} /* SỬ DỤNG BIẾN `email` */
            onChange={onChange}
            required
            disabled={loading}
            placeholder=" " /* Thêm placeholder rỗng để :not(:placeholder-shown) hoạt động nếu bạn dùng cách đó */
          />
          <label htmlFor="email">Email</label>
        </div>

        {/* Password - Floating Label & Show/Hide */}
        <div className={`form-group floating-label-group password-group ${password ? 'has-value' : ''}`}> {/* SỬ DỤNG BIẾN `password` */}
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password} /* SỬ DỤNG BIẾN `password` */
            onChange={onChange}
            required
            disabled={loading}
            placeholder=" " /* Thêm placeholder rỗng */
          />
          <label htmlFor="password">Mật khẩu</label>
          <span onClick={toggleShowPassword} className="password-toggle">
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Chưa có tài khoản? <Link to="/register" style={{ color: 'var(--color-accent)' }}>Đăng ký ngay</Link>
      </p>
    </div>
  );
}

export default LoginPage;