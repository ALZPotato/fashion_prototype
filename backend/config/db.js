const { Pool } = require('pg'); // Import class Pool từ thư viện pg
require('dotenv').config();     // Đảm bảo biến môi trường từ .env được đọc

// Tạo một instance của Pool để quản lý kết nối
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Hàm để kiểm tra kết nối (tùy chọn nhưng hữu ích)
const checkDbConnection = async () => {
  let client; // Khai báo client ở ngoài để có thể release trong finally
  try {
    client = await pool.connect(); // Cố gắng lấy một kết nối từ pool
    console.log('✅ Database connected successfully!');
    // Bạn có thể thực hiện một query đơn giản ở đây để chắc chắn hơn
    // const res = await client.query('SELECT NOW()');
    // console.log('Current time from DB:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection error:', err.stack);
    // Thoát ứng dụng nếu không kết nối được DB khi khởi động
    process.exit(1);
  } finally {
    // Luôn giải phóng client về lại pool dù thành công hay thất bại
    if (client) {
      client.release();
      console.log('Database client released.');
    }
  }
};

// Xuất pool để các module khác có thể sử dụng để query
// và xuất hàm kiểm tra kết nối
module.exports = {
  pool,
  checkDbConnection,
  // Có thể viết thêm các hàm query dùng chung ở đây nếu muốn
  query: (text, params) => pool.query(text, params),
};