import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Có thể cần nếu bạn muốn frontend gọi API xác thực

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Đang xác thực email của bạn...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    // Cách 1: Backend đã xử lý, chỉ hiển thị thông báo chờ redirect từ backend
    // (Như hiện tại, backend /api/auth/verify-email sẽ redirect về /login?verified=true)
    // Trong trường hợp này, trang này có thể không thực sự được hiển thị lâu
    // Hoặc bạn có thể không cần route này nếu backend redirect thẳng về trang login.
    // Tuy nhiên, để đây để phòng trường hợp link email trỏ đến frontend page này trước.

    if (token) {
        setMessage(`Đang chuyển hướng... Nếu bạn không được tự động chuyển hướng, vui lòng nhấp vào <a href="/login?verifiedViaFrontend=true">đây</a> để đến trang đăng nhập.`);
        // Giả định backend sẽ xử lý token khi được gọi trực tiếp
        // Hoặc nếu backend KHÔNG redirect mà trả về JSON, bạn sẽ gọi API ở đây:
        /*
        const verifyTokenOnFrontend = async () => {
          try {
            // GIẢ SỬ BẠN CÓ API: POST /api/auth/confirm-verification (ví dụ)
            // const response = await axios.post('http://localhost:3001/api/auth/confirm-verification', { token });
            // setMessage(response.data.message || "Xác thực email thành công! Bạn có thể đăng nhập.");
            // setTimeout(() => navigate('/login?verified=true'), 3000);

            // Hiện tại, backend tự redirect, nên phần này có thể không cần
             setMessage("Đang chờ xác thực từ máy chủ...");
             // Link email hiện tại của chúng ta trỏ trực tiếp về backend,
             // nên trang này có thể sẽ không được gọi nếu backend redirect thành công
             // Nếu link email trỏ về /verify-email của frontend:
             // window.location.href = `http://localhost:3001/api/auth/verify-email?token=${token}`; // Redirect qua backend để xử lý

          } catch (err) {
            setError(true);
            setMessage(err.response?.data?.message || "Xác thực email thất bại. Token không hợp lệ hoặc đã hết hạn.");
          }
        };
        // verifyTokenOnFrontend();
        */
    } else {
      setError(true);
      setMessage('Token xác thực không được tìm thấy. Vui lòng kiểm tra lại liên kết trong email của bạn.');
    }
  }, [location, navigate]);

  return (
    <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Xác Thực Email</h2>
      {error ? (
        <p style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: message }}></p>
      ) : (
        <p dangerouslySetInnerHTML={{ __html: message }}></p>
      )}
      <p><Link to="/login">Quay lại trang Đăng Nhập</Link></p>
    </div>
  );
}

export default VerifyEmailPage;