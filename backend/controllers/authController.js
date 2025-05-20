const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Module sẵn có của Node.js để tạo token ngẫu nhiên
const db = require('../config/db'); // Pool kết nối DB
const { sendEmail } = require('../config/mailer'); // Hàm gửi email
require('dotenv').config();

// --- HÀM ĐĂNG KÝ ---
exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào cơ bản
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
  }

  try {
    // 1. Kiểm tra email đã tồn tại chưa
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Email này đã được sử dụng.' });
    }

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt(10); // Tạo salt
    const passwordHash = await bcrypt.hash(password, salt); // Hash mật khẩu

    // 3. Tạo token xác thực email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000 * 24); // Token hết hạn sau 24 giờ

    // 4. Lưu người dùng vào database
    const newUserResult = await db.query(
      'INSERT INTO users (full_name, email, password_hash, email_verification_token, email_verification_expires, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, role',
      [fullName, email, passwordHash, verificationToken, verificationTokenExpires, 'customer'] // Mặc định là customer
    );
    const newUser = newUserResult.rows[0];

    // 5. Gửi email xác thực
    // Lưu ý: Thay đổi URL xác thực cho phù hợp với frontend của bạn
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
    // Hoặc nếu frontend xử lý, URL sẽ là của frontend:
    // const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;


    const emailHtml = `
      <h1>Chào mừng bạn đến với Thời Trang Công Sở XYZ!</h1>
      <p>Vui lòng nhấp vào liên kết bên dưới để xác thực địa chỉ email của bạn:</p>
      <a href="${verificationUrl}">Xác thực Email</a>
      <p>Liên kết này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
    `;

    await sendEmail(newUser.email, 'Xác thực Email Đăng Ký - Thời Trang XYZ', emailHtml);

    // (Tùy chọn) Thông báo cho người dùng để kiểm tra email
    // Thay vì trả về user data, có thể chỉ trả về thông báo
    res.status(201).json({
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      // user: newUser // Có thể không cần trả về user ở bước này
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi đăng ký.' });
  }
};

// --- HÀM XÁC THỰC EMAIL ---
exports.verifyEmail = async (req, res) => {
  const { token } = req.query; // Lấy token từ query param

  if (!token) {
    return res.status(400).json({ message: 'Token xác thực không hợp lệ hoặc bị thiếu.' });
  }

  try {
    // 1. Tìm người dùng bằng token và kiểm tra token chưa hết hạn
    const userResult = await db.query(
      'SELECT * FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Token xác thực không hợp lệ, đã hết hạn hoặc người dùng không tồn tại.' });
    }

    const user = userResult.rows[0];

    // 2. Nếu đã xác thực rồi thì thôi
    if (user.is_email_verified) {
      // return res.status(200).json({ message: 'Email đã được xác thực trước đó.' });
      // Chuyển hướng người dùng đến trang đăng nhập hoặc thông báo thành công trên frontend
      return res.redirect('http://localhost:5173/login?verified=true'); // Hoặc một trang thông báo
    }

    // 3. Cập nhật trạng thái xác thực và xóa token
    await db.query(
      'UPDATE users SET is_email_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL, updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // (Tùy chọn) Gửi email chào mừng/thông báo xác thực thành công

    // Chuyển hướng người dùng đến trang đăng nhập hoặc thông báo thành công trên frontend
    // Ví dụ: res.send('<h1>Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.</h1>');
    res.redirect('http://localhost:5173/login?verified=true'); // Chuyển hướng tới trang login của frontend

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi xác thực email.' });
  }
};

// --- HÀM ĐĂNG NHẬP ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
  }

  try {
    // 1. Tìm người dùng bằng email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' }); // Thông báo chung chung
    }

    const user = userResult.rows[0];

    // 2. Kiểm tra email đã được xác thực chưa
    if (!user.is_email_verified) {
      return res.status(403).json({ message: 'Vui lòng xác thực email của bạn trước khi đăng nhập.' });
    }

    // 3. So sánh mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' }); // Thông báo chung chung
    }

    // 4. Tạo JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name
        // Không nên đưa các thông tin nhạy cảm khác vào JWT
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, // Thời gian hết hạn
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Đăng nhập thành công!',
          token, // Trả về token cho client
          user: { // Trả về thông tin user cơ bản (không có password_hash)
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi đăng nhập.' });
  }
};