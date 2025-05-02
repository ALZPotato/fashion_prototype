// Import các thư viện cần thiết
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Import module db của chúng ta
require('dotenv').config(); // Để đọc biến môi trường từ file .env

// Khởi tạo ứng dụng Express
const app = express();

// Sử dụng các middleware
app.use(cors()); // Cho phép truy cập từ các nguồn khác (ví dụ: frontend React)
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request body

// Định nghĩa một route API đơn giản để kiểm tra
// GET /api/test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// TODO: Thêm các routes khác cho products sau này
// GET /api/products - Lấy danh sách sản phẩm CÓ PHÂN TRANG
app.get('/api/products', async (req, res) => {
  // Lấy page và limit từ query params, đặt giá trị mặc định nếu không có
  const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
  const limit = parseInt(req.query.limit) || 12; // Mặc định 12 sản phẩm/trang

  // Tính toán offset cho query
  const offset = (page - 1) * limit;

  console.log(`Received request for /api/products - Page: ${page}, Limit: ${limit}, Offset: ${offset}`);

  try {
    // --- Thực hiện 2 query song song để tối ưu ---
    const productsQuery = `
      SELECT id, name, price, image_url
      FROM products
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = 'SELECT COUNT(*) AS total_items FROM products';

    // Sử dụng Promise.all để chạy cả 2 query cùng lúc
    const [productsResult, countResult] = await Promise.all([
      db.query(productsQuery, [limit, offset]), // Query lấy sản phẩm
      db.query(countQuery)                      // Query đếm tổng số sản phẩm
    ]);

    const products = productsResult.rows;
    const totalItems = parseInt(countResult.rows[0].total_items); // Lấy tổng số sản phẩm
    const totalPages = Math.ceil(totalItems / limit); // Tính tổng số trang

    console.log(`Found ${products.length} products for page ${page}. Total items: ${totalItems}, Total pages: ${totalPages}`);

    // Trả về dữ liệu bao gồm sản phẩm và thông tin phân trang
    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      products: products,
    });

  } catch (err) {
    console.error('Error querying products with pagination:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Lấy cổng từ biến môi trường hoặc dùng cổng 3001 mặc định
const PORT = process.env.PORT || 3001;

// Kiểm tra kết nối database trước khi khởi động server
db.checkDbConnection().then(() => {
  // Chỉ khởi động server nếu kết nối DB thành công
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
