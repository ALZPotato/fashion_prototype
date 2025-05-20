const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  // Với port 587, secure là false vì nodemailer sẽ tự nâng cấp lên STARTTLS
  // Với port 465, secure là true
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER, // Lấy từ .env
    pass: process.env.EMAIL_PASS, // Lấy từ .env (App Password)
  },
  // Không cần tls: { rejectUnauthorized: false } với Gmail thật nếu cấu hình đúng
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // "Tên Hiển Thị <email_gui@gmail.com>"
      to: to,                       // Email người dùng đăng ký
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    console.log('Message ID:', info.messageId);
    // Với Gmail thật, không có Preview URL như Ethereal
    // console.log('Preview URL (Ethereal): %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email via Gmail: ', error);
    throw error;
  }
};

module.exports = { sendEmail };