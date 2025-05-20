import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // File CSS chung vẫn dùng

// Ký tự unicode cho icon mắt (hoặc bạn có thể dùng SVG/icon font)
const EyeIcon = () => <span className="eye-icon">👁️</span>;
const EyeSlashIcon = () => <span className="eye-icon eye-slash">👁️</span>; // Sẽ style khác bằng CSS

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State để quản lý việc hiển thị mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { fullName, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (e) => {
    e.preventDefault();
    // ... (logic onSubmit giữ nguyên như trước) ...
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const newUser = { fullName, email, password };
      const response = await axios.post(
        'http://localhost:3001/api/auth/register',
        newUser
      );
      setSuccessMessage(response.data.message + " Bạn sẽ được chuyển đến trang đăng nhập sau giây lát.");
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <h2>Đăng Ký Tài Khoản</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={onSubmit} className="auth-form">
        {/* Full Name - Floating Label */}
        <div className={`form-group floating-label-group ${fullName ? 'has-value' : ''}`}>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={onChange}
            required
            disabled={loading}
          />
          <label htmlFor="fullName">Họ và Tên</label>
        </div>

        {/* Email - Floating Label */}
        <div className={`form-group floating-label-group ${email ? 'has-value' : ''}`}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            disabled={loading}
          />
          <label htmlFor="email">Email</label>
        </div>

        {/* Password - Floating Label & Show/Hide */}
        <div className={`form-group floating-label-group password-group ${password ? 'has-value' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
            disabled={loading}
          />
          <label htmlFor="password">Mật khẩu</label>
          <span onClick={toggleShowPassword} className="password-toggle">
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>

        {/* Confirm Password - Floating Label & Show/Hide */}
        <div className={`form-group floating-label-group password-group ${confirmPassword ? 'has-value' : ''}`}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            minLength="6"
            required
            disabled={loading}
          />
          <label htmlFor="confirmPassword">Xác nhận Mật khẩu</label>
          <span onClick={toggleShowConfirmPassword} className="password-toggle">
            {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng Ký'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;