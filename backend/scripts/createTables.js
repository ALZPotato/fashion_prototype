// Import pool từ file config
const { pool } = require('../config/db'); // Đường dẫn tương đối từ scripts đến config

// Định nghĩa câu lệnh SQL để tạo bảng products
const createProductTableQuery = `
DROP TABLE IF EXISTS products; -- Xóa bảng nếu đã tồn tại để chạy lại script dễ dàng
CREATE TABLE products (
    id SERIAL PRIMARY KEY,                     -- Khóa chính tự tăng
    name VARCHAR(255) NOT NULL,                -- Tên sản phẩm, không được null
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- Giá sản phẩm, số thập phân, không âm
    description TEXT,                          -- Mô tả sản phẩm (có thể null)
    image_url VARCHAR(512),                    -- URL hình ảnh (có thể null)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Thời gian tạo
);
`;

// Hàm async để thực thi query
const createTables = async () => {
  console.log('Attempting to create tables...');
  try {
    // Gửi query đến database pool
    await pool.query(createProductTableQuery);
    console.log('Table "products" created successfully (or already existed and was replaced).');
  } catch (err) {
    console.error('Error creating tables:', err.stack);
  } finally {
    // Đóng pool kết nối sau khi script chạy xong
    await pool.end();
    console.log('Database pool closed.');
  }
};

// Gọi hàm để thực thi
createTables();