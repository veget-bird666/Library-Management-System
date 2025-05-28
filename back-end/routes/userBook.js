const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 用户端图书查询
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      size = 10,
      category,
      keyword 
    } = req.query;

    let baseQuery = 'SELECT * FROM book';
    const conditions = [];
    const params = [];

    if (keyword) {
      conditions.push('(title LIKE ? OR author LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (conditions.length) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    const offset = (page - 1) * size;
    const [books] = await db.execute(
      `${baseQuery} LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    const [total] = await db.execute(
      `SELECT COUNT(*) as total FROM (${baseQuery}) AS total_query`,
      params
    );

    res.json({
      success: true,
      data: books,
      pagination: {
        total: total[0].total,
        page: Number(page),
        pageSize: Number(size),
        totalPages: Math.ceil(total[0].total / size)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: '图书查询失败'
    });
  }
});

module.exports = router;