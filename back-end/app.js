const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book'); 
const userBookRoutes = require('./routes/userBook');
const borrowRoutes = require('./routes/borrow');
const userBorrowRoutes = require('./routes/userborrow');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/userBooks', userBookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/userborrow', userBorrowRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Library Management System API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;