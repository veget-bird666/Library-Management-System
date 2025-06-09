const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 获取用户已借阅的图书列表
router.get('/borrowed', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { userAccount, page = 1, size = 10 } = req.query;
    
    if (!userAccount) {
      return res.status(400).json({
        success: false,
        message: '请提供用户账号'
      });
    }

    const pageInt = parseInt(page);
    const sizeInt = parseInt(size);
    const offset = (pageInt - 1) * sizeInt;

    // 获取借阅记录
    const query = `
      SELECT 
        b.book_id,
        b.title,
        b.author,
        b.publisher,
        b.category,
        b.publication_year,
        b.language,
        br.record_id,
        br.borrow_time,
        br.should_return_time,
        br.status,
        br.is_overdue,
        DATE_FORMAT(br.borrow_time, '%Y-%m-%d %H:%i:%s') as formatted_borrow_time,
        DATE_FORMAT(br.should_return_time, '%Y-%m-%d') as formatted_should_return_time,
        CASE 
          WHEN br.status = 1 AND br.is_overdue = 1 THEN '已超期'
          WHEN br.status = 1 THEN '借阅中'
          WHEN br.status = 2 THEN '已归还'
          WHEN br.status = 3 THEN '已超期'
          ELSE '未知'
        END as status_text,
        DATEDIFF(br.should_return_time, CURRENT_DATE()) as remaining_days
      FROM borrow_record br
      INNER JOIN book b ON br.book_id = b.book_id
      WHERE br.user_account = ?
      ORDER BY 
        CASE 
          WHEN br.status = 1 AND br.is_overdue = 1 THEN 1
          WHEN br.status = 1 THEN 2
          ELSE 3
        END,
        br.borrow_time DESC
      LIMIT ? OFFSET ?`;

    const [books] = await connection.query(query, [userAccount, sizeInt, offset]);

    // 获取总数
    const [total] = await connection.query(
      'SELECT COUNT(*) as total FROM borrow_record WHERE user_account = ?',
      [userAccount]
    );

    res.json({
      success: true,
      data: books,
      pagination: {
        total: total[0].total,
        page: pageInt,
        pageSize: sizeInt,
        totalPages: Math.ceil(total[0].total / sizeInt)
      }
    });
  } catch (err) {
    console.error('获取用户借阅记录失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取借阅记录失败'
    });
  } finally {
    if (connection) {
      await connection.release();
    }
  }
});

// 获取用户的借阅申请列表
router.get('/applications', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { userAccount, page = 1, size = 10 } = req.query;
    
    if (!userAccount) {
      return res.status(400).json({
        success: false,
        message: '请提供用户账号'
      });
    }

    const pageInt = parseInt(page);
    const sizeInt = parseInt(size);
    const offset = (pageInt - 1) * sizeInt;

    // 获取申请列表
    const [applications] = await connection.query(
      `SELECT 
        ba.application_id,
        ba.book_id,
        b.title as book_title,
        ba.apply_time,
        ba.status,
        CASE 
          WHEN ba.status = 0 THEN '待处理'
          WHEN ba.status = 1 THEN '已批准'
          WHEN ba.status = 2 THEN '已拒绝'
          ELSE '未知'
        END as status_text,
        ba.user_remark,
        ba.admin_remark,
        DATE_FORMAT(ba.apply_time, '%Y-%m-%d %H:%i:%s') as formatted_apply_time,
        DATE_FORMAT(ba.process_time, '%Y-%m-%d %H:%i:%s') as formatted_process_time
      FROM borrow_application ba
      INNER JOIN book b ON ba.book_id = b.book_id
      WHERE ba.user_account = ?
      ORDER BY ba.apply_time DESC
      LIMIT ? OFFSET ?`,
      [userAccount, sizeInt, offset]
    );

    // 获取总数
    const [total] = await connection.query(
      `SELECT COUNT(*) as total 
       FROM borrow_application 
       WHERE user_account = ?`,
      [userAccount]
    );

    res.json({
      success: true,
      data: applications,
      pagination: {
        total: total[0].total,
        page: pageInt,
        pageSize: sizeInt,
        totalPages: Math.ceil(total[0].total / sizeInt)
      }
    });
  } catch (err) {
    console.error('获取用户借阅申请列表失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取借阅申请列表失败'
    });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('释放数据库连接失败:', err);
      }
    }
  }
});

// 提交借阅申请
router.post('/apply', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { bookId, userAccount, userRemark } = req.body;

    if (!bookId || !userAccount) {
      return res.status(400).json({
        success: false,
        message: '图书ID和用户账号不能为空'
      });
    }

    // 检查是否已有待处理的申请
    const [existingApplications] = await connection.query(
      'SELECT * FROM borrow_application WHERE book_id = ? AND user_account = ? AND status = 0',
      [bookId, userAccount]
    );

    if (existingApplications.length > 0) {
      return res.status(400).json({
        success: false,
        message: '您已经申请过这本书了，请等待管理员处理'
      });
    }

    // 检查图书是否可借
    const [borrowRecords] = await connection.query(
      'SELECT * FROM borrow_record WHERE book_id = ? AND status = 1',
      [bookId]
    );

    if (borrowRecords.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该图书已被借出'
      });
    }

    // 插入申请记录
    await connection.query(
      'INSERT INTO borrow_application (book_id, user_account, user_remark, status) VALUES (?, ?, ?, 0)',
      [bookId, userAccount, userRemark || null]
    );

    res.json({
      success: true,
      message: '借阅申请提交成功'
    });
  } catch (err) {
    console.error('提交借阅申请失败:', err);
    res.status(500).json({ 
      success: false,
      message: '提交借阅申请失败'
    });
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (err) {
        console.error('释放数据库连接失败:', err);
      }
    }
  }
});

module.exports = router; 