// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route để lấy tất cả sản phẩm (có phân trang)
// GET /api/products/
router.get('/', productController.getAllProducts);

// --- ROUTE MỚI: Lấy chi tiết một sản phẩm bằng ID ---
// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;