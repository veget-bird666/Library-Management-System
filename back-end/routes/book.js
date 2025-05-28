// 图书管理路由
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取所有图书（带分页和过滤）
router.get('/', async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  try {
    const { 
      page = 1, 
      size = 10, 
      category, 
      author, 
      year, 
      keyword 
    } = req.query;

    let baseQuery = 'SELECT * FROM book';
    const conditions = [];
    const params = [];

    // 构建查询条件
    if (keyword) {
      conditions.push('(title LIKE ? OR author LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (author) {
      conditions.push('author LIKE ?');
      params.push(`%${author}%`);
    }
    if (year) {
      conditions.push('publication_year = ?');
      params.push(year);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // 分页处理
    const offset = (page - 1) * size;
    const fullQuery = `${baseQuery} LIMIT ${size} OFFSET ${offset}`;
    console.log('🔍 GET /api/books SQL:', fullQuery, 'PARAMS:', params);
    // 这里只将 WHERE 条件参数传入
    const [books] = await db.execute(fullQuery, params);

    // 获取总数
    const [total] = await db.execute(baseQuery, params);
    
    res.json({
      success: true,
      data: books,
      pagination: {
        total: total, // 使用COUNT结果
        page: Number(page),
        pageSize: Number(size),
        totalPages: Math.ceil(total / size)
      }
    });
  } catch (err) {
    console.error('❌ Error in GET /api/books:', err);
    next(err);// 传递给错误处理中间件
  }
});

// 添加新书
router.post('/', async (req, res, next) => {
  try {
    const { 
      book_id, 
      title, 
      publisher, 
      publication_date, 
      category, 
      author, 
      price, 
      description, 
      language 
    } = req.body;

     // 1. ISBN 规范化
     const normalizedId = (book_id || '').replace(/\D/g, '');
     if (!/^\d{17}$/.test(normalizedId)) {
       return res.status(400).json({
         success: false,
         message: 'ISBN 格式不正确（应为 17 位纯数字：13 位 ISBN + 4 位附加码）'
       });
     }
     const finalBookId = normalizedId;
 
     // 2. 计算 publication_year
     const publication_year = publication_date
       ? new Date(publication_date).getFullYear()
       : new Date().getFullYear();
 
     // 3. 参数校验——确保都不是 undefined
     if (
       !finalBookId ||
       !title ||
       !publisher ||
       !category ||
       !author ||
       price == null ||
       !language
     ) {
       return res.status(400).json({
         success: false,
         message: '请填写所有必填字段'
       });
     }
 
     // 4. 打印一下，查看到底传了哪些参数
     console.log('>>> INSERT book params:', [
       finalBookId,
       title,
       publisher,
       publication_year,
       category,
       author,
       price,
       description,
       language
     ]);
 
     // 5. 真正执行插入
     const sql = `
       INSERT INTO book
       (book_id, title, publisher, publication_year, category, author, price, description, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     `;
 
     await db.execute(sql, [
       finalBookId,
       title,
       publisher,
       publication_year,
       category,
       author,
       price,
       description,
       language
     ]);
 
     return res.status(201).json({
       success: true,
       data: { book_id: finalBookId },
       message: '图书添加成功'
     });
  } catch (err) {
    next(err);
  }
});

// （可选）获取单本图书详情
router.get('/:book_id', async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM book WHERE book_id = ?',
      [book_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '图书未找到' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// 更新图书
router.put('/:book_id', async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const updates = req.body;
    const fields = [];
    const params = [];

    for (let key in updates) {
      fields.push(`${key} = ?`);
      params.push(updates[key]);
    }
    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: '无更新内容' });
    }

    params.push(book_id);
    await db.execute(
      `UPDATE book SET ${fields.join(', ')} WHERE book_id = ?`,
      params
    );
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    next(err);
  }
});

// 删除图书
router.delete('/:book_id', async (req, res, next) => {
  try {
    const { book_id } = req.params;
    await db.execute('DELETE FROM book WHERE book_id = ?', [book_id]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
