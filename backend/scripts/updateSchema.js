const { pool } = require('../config/db');

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'admin'
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) UNIQUE,
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
// (Bạn có thể thêm các bảng khác ở đây nếu cần trong tương lai)

const updateSchema = async () => {
  console.log('Attempting to update database schema...');
  try {
    await pool.query(createUserTableQuery);
    console.log('Table "users" ensured/created successfully.');
    // Thêm các query tạo bảng khác ở đây nếu có
  } catch (err) {
    console.error('Error updating schema:', err.stack);
  } finally {
    await pool.end();
    console.log('Database pool closed after schema update.');
  }
};

updateSchema();