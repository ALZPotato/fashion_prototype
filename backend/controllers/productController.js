// backend/controllers/productController.js
const db = require('../config/db'); // Pool kết nối DB

// Hàm lấy tất cả sản phẩm (có phân trang)
// (Nếu bạn đã có hàm này từ trước, hãy giữ lại hoặc đảm bảo nó đúng)
exports.getAllProducts = async (req, res) => {
  // Phân trang
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12; // Số sản phẩm mỗi trang
  const offset = (page - 1) * limit;

  // Lọc và Tìm kiếm
  const { search, category, minPrice, maxPrice, sortBy } = req.query;

  // Xây dựng câu lệnh WHERE động
  let whereClauses = [];
  let queryParams = [];
  let paramIndex = 1; // Để đánh số thứ tự cho các params trong SQL query

  if (search) {
    whereClauses.push(`name ILIKE $${paramIndex++}`); // ILIKE cho tìm kiếm không phân biệt hoa thường
    queryParams.push(`%${search}%`); // % cho phép tìm kiếm khớp một phần
  }
  if (category) { // Giả sử category là ID hoặc một chuỗi tên
    // Nếu category là ID: whereClauses.push(`category_id = $${paramIndex++}`);
    // Nếu category là tên (cần bảng categories hoặc cột category trong products):
    // whereClauses.push(`category_name = $${paramIndex++}`); // Ví dụ
    // queryParams.push(category);
    // TẠM THỜI BỎ QUA LỌC CATEGORY VÌ CHƯA CÓ BẢNG CATEGORIES
  }
  if (minPrice) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      whereClauses.push(`price >= $${paramIndex++}`);
      queryParams.push(min);
    }
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      whereClauses.push(`price <= $${paramIndex++}`);
      queryParams.push(max);
    }
  }

  const whereCondition = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Xây dựng mệnh đề ORDER BY động
  let orderByCondition = 'ORDER BY created_at DESC'; // Mặc định sắp xếp theo mới nhất
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        orderByCondition = 'ORDER BY price ASC';
        break;
      case 'price_desc':
        orderByCondition = 'ORDER BY price DESC';
        break;
      case 'name_asc':
        orderByCondition = 'ORDER BY name ASC';
        break;
      case 'name_desc':
        orderByCondition = 'ORDER BY name DESC';
        break;
      // Thêm các trường hợp sắp xếp khác nếu cần
    }
  }

  try {
    // Query để lấy sản phẩm (thêm LIMIT và OFFSET cho phân trang SAU KHI đã có WHERE và ORDER BY)
    const productsQueryString = `
      SELECT id, name, price, image_url, description, created_at
      FROM products
      ${whereCondition}
      ${orderByCondition}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    // Thêm limit và offset vào cuối mảng queryParams
    const finalProductParams = [...queryParams, limit, offset];

    // Query để đếm tổng số sản phẩm (phải có cùng điều kiện WHERE)
    const countQueryString = `SELECT COUNT(*) AS total_items FROM products ${whereCondition}`;
    // Query đếm chỉ dùng các params của whereCondition
    const finalCountParams = [...queryParams];


    console.log('Product Query:', productsQueryString, finalProductParams); // Log để debug
    console.log('Count Query:', countQueryString, finalCountParams); // Log để debug


    const [productsResult, countResult] = await Promise.all([
      db.query(productsQueryString, finalProductParams),
      db.query(countQueryString, finalCountParams)
    ]);

    const products = productsResult.rows;
    const totalItems = parseInt(countResult.rows[0].total_items);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      products: products,
      filtersApplied: { // Gửi lại các filter đã áp dụng để frontend có thể hiển thị
        search, category, minPrice, maxPrice, sortBy
      }
    });

  } catch (err) {
    console.error('Error querying products with filters/search:', err.stack);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy danh sách sản phẩm.' });
  }
};

// --- HÀM MỚI: Lấy chi tiết một sản phẩm bằng ID ---
exports.getProductById = async (req, res) => {
  const { id } = req.params; // Lấy id từ URL params (ví dụ: /api/products/123)

  // Kiểm tra sơ bộ id có phải là số không
  if (isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID sản phẩm không hợp lệ.' });
  }

  try {
    const productResult = await db.query('SELECT * FROM products WHERE id = $1', [id]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tìm thấy.' });
    }

    res.json(productResult.rows[0]); // Trả về sản phẩm (là một object)
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy chi tiết sản phẩm.' });
  }
};