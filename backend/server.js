// Import các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Import module db của chúng ta
require('dotenv').config(); // Để đọc biến môi trường từ file .env
const authRoutes = require('./routes/authRoutes'); 
const productRoutes = require('./routes/productRoutes'); 

// Khởi tạo ứng dụng Express
const app = express();

// Sử dụng các middleware
app.use(cors()); // Cho phép truy cập từ các nguồn khác (ví dụ: frontend React)
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body
// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Lấy cổng từ biến môi trường hoặc dùng cổng 3001 mặc định
const PORT = process.env.PORT || 3001;

// Kiểm tra kết nối database trước khi khởi động server
db.checkDbConnection().then(() => {
  // Chỉ khởi động server nếu kết nối DB thành công
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
