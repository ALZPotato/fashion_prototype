const { pool } = require('../config/db');
const { faker } = require('@faker-js/faker');

// Số lượng sản phẩm muốn tạo
const numberOfProducts = 1000;

// Danh sách các loại sản phẩm công sở mẫu
const officeWearTypes = [
  'Sơ mi', 'Áo kiểu', 'Quần tây', 'Chân váy', 'Đầm công sở', 'Vest', 'Blazer',
  'Giày cao gót', 'Giày bệt', 'Túi xách', 'Cặp tài liệu'
];

// Danh sách các tính từ/chất liệu/màu sắc liên quan
const officeWearAttributes = [
  'Lụa', 'Cotton', 'Kaki', 'Kate', 'Dáng ôm', 'Dáng suông', 'Thanh lịch', 'Cao cấp',
  'Trắng', 'Đen', 'Xanh navy', 'Beige', 'Xám', 'Kẻ sọc', 'Họa tiết nhỏ'
];

// Hàm tạo dữ liệu sản phẩm giả phù hợp hơn
const generateOfficeProduct = () => {
  const type = faker.helpers.arrayElement(officeWearTypes); // Chọn ngẫu nhiên loại
  const attribute = faker.helpers.arrayElement(officeWearAttributes); // Chọn ngẫu nhiên thuộc tính
  const productName = `${type} ${attribute}`; // Ghép lại thành tên sản phẩm

  const price = faker.commerce.price({ min: 150000, max: 3000000, dec: 0 }); // Giá phù hợp hơn
  const description = `Một sản phẩm ${productName} ${faker.commerce.productDescription().toLowerCase()}`; // Mô tả có chứa tên
  const imageUrl = `https://picsum.photos/seed/${faker.string.uuid()}/400/300`; // Vẫn dùng ảnh placeholder

  return [productName, price, description, imageUrl];
};

// Hàm async để xóa và chèn dữ liệu
const seedProducts = async () => {
  const client = await pool.connect(); // Kết nối đến DB
  console.log('Database connected for seeding.');

  try {
    // Xóa dữ liệu cũ trong bảng products và reset ID sequence
    console.log('Truncating products table...');
    await client.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE;');
    console.log('Products table truncated.');

    // Bắt đầu tạo và chèn dữ liệu mới
    console.log(`Attempting to seed ${numberOfProducts} office wear products...`);
    const products = [];
    for (let i = 0; i < numberOfProducts; i++) {
      products.push(generateOfficeProduct());
    }

    const placeholders = products.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(',');
    const insertQuery = `
      INSERT INTO products (name, price, description, image_url)
      VALUES ${placeholders};
    `;
    const values = products.flat();

    const startTime = Date.now();
    await client.query(insertQuery, values); // Dùng client đã kết nối
    const endTime = Date.now();
    console.log(`Successfully seeded ${numberOfProducts} products in ${endTime - startTime}ms.`);

  } catch (err) {
    console.error('Error seeding products:', err.stack);
  } finally {
    // Giải phóng client về lại pool
    client.release();
    console.log('Database client released.');
    // Đóng pool kết nối (quan trọng khi chạy script độc lập)
    await pool.end();
    console.log('Database pool closed.');
  }
};

// Gọi hàm để thực thi
seedProducts();