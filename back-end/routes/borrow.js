const express = require('express');
const router = express.Router();
const db = require('../config/database');

// 借阅图书
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { userAccount, bookId } = req.body;
    console.log(userAccount,bookId);
    
    // 检查参数
    if (!userAccount || !bookId) {
      return res.status(400).json({
        success: false,
        message: '用户账号和图书ID不能为空'
      });
    }

    // 检查图书是否存在且可借
    const [books] = await connection.query(
      'SELECT * FROM book WHERE book_id = ?',
      [bookId]
    );

    if (books.length === 0) {
      return res.status(400).json({
        success: false,
        message: '图书不存在'
      });
    }

    // 检查图书是否已被借出
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

    // 检查用户是否存在
    const [users] = await connection.query(
      'SELECT * FROM user WHERE user_account = ?',
      [userAccount]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 开始事务
    await connection.beginTransaction();

    try {
      // 插入借阅记录
      await connection.query(
        'INSERT INTO borrow_record (book_id, user_account, status, borrow_time) VALUES (?, ?, 1, CURRENT_TIMESTAMP)',
        [bookId, userAccount]
      );

      await connection.commit();

      // 获取借阅记录详情
      const [newRecord] = await connection.query(
        'SELECT *, DATE_FORMAT(borrow_time, "%Y-%m-%d %H:%i:%s") as formatted_borrow_time, DATE_FORMAT(should_return_time, "%Y-%m-%d") as formatted_should_return_time FROM borrow_record WHERE book_id = ? AND user_account = ? AND status = 1',
        [bookId, userAccount]
      );

      res.json({
        success: true,
        message: '借阅成功',
        data: {
          recordId: newRecord[0].record_id,
          bookId: newRecord[0].book_id,
          userAccount: newRecord[0].user_account,
          borrowTime: newRecord[0].formatted_borrow_time,
          shouldReturnTime: newRecord[0].formatted_should_return_time
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (err) {
    console.error('借阅图书时发生错误:', err);
    res.status(500).json({
      success: false,
      message: '借阅失败'
    });
  } finally {
    connection.release();
  }
});

// 搜索可借图书
router.get('/available', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const[users] = await db.execute('SELECT * FROM user');
    console.log(users.lastIndexOf);
    console.log(users);

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: '请输入搜索关键词'
      });
    }

    const searchPattern = `%${keyword}%`;
    const offset = (page - 1) * size;

    // 修改查询逻辑，使用 query 替代 execute
    const [books] = await db.query(
      `SELECT DISTINCT b.* 
      FROM book b 
      LEFT JOIN borrow_record br ON b.book_id = br.book_id AND br.status = 1
      WHERE br.record_id IS NULL
      AND (b.title LIKE ? OR b.author LIKE ? OR b.book_id LIKE ?)
      LIMIT ?, ?`,
      [searchPattern, searchPattern, searchPattern, offset, size]
    );

    // 获取总数
    const [total] = await db.query(
      `SELECT COUNT(DISTINCT b.book_id) as total 
       FROM book b 
       LEFT JOIN borrow_record br ON b.book_id = br.book_id AND br.status = 1
       WHERE br.record_id IS NULL
       AND (b.title LIKE ? OR b.author LIKE ? OR b.book_id LIKE ?)`,
      [searchPattern, searchPattern, searchPattern]
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
    console.error('搜索可借图书时发生错误:', err);
    console.error(err.stack);
    res.status(500).json({ 
      success: false,
      message: '搜索图书失败'
    });
  }
});

// 归还图书
router.post('/return', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { userAccount, bookId } = req.body;
    
    // 检查参数
    if (!userAccount || !bookId) {
      return res.status(400).json({
        success: false,
        message: '用户账号和图书ID不能为空'
      });
    }

    // 检查借阅记录是否存在
    const [borrowRecords] = await connection.query(
      'SELECT * FROM borrow_record WHERE book_id = ? AND user_account = ? AND status = 1',
      [bookId, userAccount]
    );

    if (borrowRecords.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未找到相应的借阅记录或图书已归还'
      });
    }

    // 开始事务
    await connection.beginTransaction();

    try {
      // 更新借阅记录状态
      await connection.query(
        'UPDATE borrow_record SET status = 2, return_time = CURRENT_TIMESTAMP WHERE book_id = ? AND user_account = ? AND status = 1',
        [bookId, userAccount]
      );

      // 获取更新后的借阅记录详情
      const [updatedRecord] = await connection.query(
        'SELECT *, DATE_FORMAT(borrow_time, "%Y-%m-%d %H:%i:%s") as formatted_borrow_time, DATE_FORMAT(return_time, "%Y-%m-%d %H:%i:%s") as formatted_return_time FROM borrow_record WHERE book_id = ? AND user_account = ? AND status = 2 ORDER BY return_time DESC LIMIT 1',
        [bookId, userAccount]
      );

      await connection.commit();

      res.json({
        success: true,
        message: '归还成功',
        data: {
          recordId: updatedRecord[0].record_id,
          bookId: updatedRecord[0].book_id,
          userAccount: updatedRecord[0].user_account,
          borrowTime: updatedRecord[0].formatted_borrow_time,
          returnTime: updatedRecord[0].formatted_return_time,
          status: updatedRecord[0].status
        }
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (err) {
    console.error('归还图书时发生错误:', err);
    res.status(500).json({
      success: false,
      message: '归还失败'
    });
  } finally {
    connection.release();
  }
});

// 查询用户已借阅图书
router.get('/borrowed', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { 
      userAccount,
      page = 1, 
      size = 10 
    } = req.query;
    console.log('查询用户借阅记录，用户账号:', userAccount);

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
    const [books] = await connection.query(
      `SELECT 
        b.*,
        br.record_id,
        br.borrow_time,
        br.should_return_time,
        br.status,
        DATE_FORMAT(br.borrow_time, '%Y-%m-%d %H:%i:%s') as formatted_borrow_time,
        DATE_FORMAT(br.should_return_time, '%Y-%m-%d') as formatted_should_return_time
      FROM book b 
      INNER JOIN borrow_record br ON b.book_id = br.book_id
      WHERE br.user_account = ? AND br.status = 1
      ORDER BY br.borrow_time DESC
      LIMIT ? OFFSET ?`,
      [userAccount, sizeInt, offset]
    );

    // 获取总数
    const [total] = await connection.query(
      `SELECT COUNT(*) as total 
       FROM borrow_record br
       WHERE br.user_account = ? AND br.status = 1`,
      [userAccount]
    );

    // 格式化返回数据
    const formattedBooks = books.map(book => ({
      ...book,
      borrow_time: book.formatted_borrow_time,
      should_return_time: book.formatted_should_return_time
    }));

    res.json({
      success: true,
      data: formattedBooks,
      pagination: {
        total: total[0].total,
        page: pageInt,
        pageSize: sizeInt,
        totalPages: Math.ceil(total[0].total / sizeInt)
      }
    });
  } catch (err) {
    console.error('查询用户借阅记录时发生错误:', err);
    res.status(500).json({ 
      success: false,
      message: '查询借阅记录失败'
    });
  } finally {
    connection.release();
  }
});

router.get('/list', async (req, res) => {
  try {
    const { page = 1, size = 10, status = 1 } = req.query;

    const pageInt = parseInt(page);
    const sizeInt = Math.max(1, Math.min(100, parseInt(size)));
    const statusInt = parseInt(status);
    const offset = (pageInt - 1) * sizeInt;

    const [records] = await db.query(
      `SELECT 
        br.record_id,
        b.title as book_title,
        b.book_id,
        u.nickname,
        u.user_account,
        DATE_FORMAT(br.borrow_time, '%Y-%m-%d %H:%i:%s') as borrow_time,
        DATE_FORMAT(br.should_return_time, '%Y-%m-%d') as should_return_time,
        DATE_FORMAT(br.return_time, '%Y-%m-%d %H:%i:%s') as return_time,
        br.status,
        CASE 
          WHEN br.status = 1 THEN '借出'
          WHEN br.status = 2 THEN '已归还'
          ELSE '未知'
        END as status_text
      FROM borrow_record br
      INNER JOIN book b ON br.book_id = b.book_id
      INNER JOIN user u ON br.user_account = u.user_account
      WHERE br.status = ? 
      ORDER BY br.borrow_time DESC 
      LIMIT ?, ?`,
      [statusInt, offset, sizeInt]
    );

    const [total] = await db.query(
      `SELECT COUNT(*) as total 
       FROM borrow_record 
       WHERE status = ?`,
      [statusInt]
    );

    res.json({
      success: true,
      data: records,
      pagination: {
        total: total[0].total,
        page: pageInt,
        pageSize: sizeInt,
        totalPages: Math.ceil(total[0].total / sizeInt)
      }
    });

  } catch (err) {
    console.error('获取借阅记录列表错误详情:', {
      error: err,
      stack: err.stack,
      requestQuery: req.query
    });

    res.status(500).json({ 
      success: false,
      message: err.message || '获取借阅记录失败',
      errorDetails: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});
// 删除借阅记录
router.delete('/:recordId', async (req, res) => {
  try {
    // const statusRaw = parseInt(status) || 1;
    // const sizeRaw = Math.max(1, Math.min(100, parseInt(size) || 10));
    // const pageRaw = parseInt(page) || 1;
    // const offsetRaw = (pageRaw - 1) * sizeRaw;

    // // 确保是原始 number 类型
    // const args = [statusRaw + 0, sizeRaw + 0, offsetRaw + 0];

    // console.log('最终传参:', args.map(a => typeof a));

    // // 执行查询
    // await db.execute(your_sql, args);
    const { recordId } = req.params;

    // 检查记录是否存在
    const [record] = await db.execute(
      'SELECT * FROM borrow_record WHERE record_id = ?',
      [recordId]
    );

    if (record.length === 0) {
      return res.status(404).json({
        success: false,
        message: '借阅记录不存在'
      });
    }

    // 开始事务
    await db.execute('START TRANSACTION');

    try {
      // 删除借阅记录
      await db.execute(
        'DELETE FROM borrow_record WHERE record_id = ?',
        [recordId]
      );

      await db.execute('COMMIT');

      res.json({
        success: true,
        message: '借阅记录删除成功',
        data: {
          recordId: recordId
        }
      });
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (err) {
    console.error('删除借阅记录时发生错误:', err);
    res.status(500).json({
      success: false,
      message: '删除借阅记录失败'
    });
  }
});

// 获取管理员的借阅申请列表
router.get('/applications', async (req, res) => {
  try {
    const { page = 1, size = 10, admin_account } = req.query;

    const pageInt = parseInt(page);
    const sizeInt = Math.max(1, Math.min(100, parseInt(size)));
    const offset = (pageInt - 1) * sizeInt;

    // 获取申请列表
    const [applications] = await db.query(
      `SELECT 
        ba.application_id,
        ba.book_id,
        b.title as book_title,
        ba.user_account,
        u.nickname as user_nickname,
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
      INNER JOIN user u ON ba.user_account = u.user_account
      WHERE u.admin_account = ?
      ORDER BY ba.apply_time DESC
      LIMIT ?, ?`,
      [admin_account, offset, sizeInt]
    );

    // 获取总数
    const [total] = await db.query(
      `SELECT COUNT(*) as total 
       FROM borrow_application ba
       INNER JOIN user u ON ba.user_account = u.user_account
       WHERE u.admin_account = ?`,
      [admin_account]
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
    console.error('获取借阅申请列表失败:', err);
    res.status(500).json({ 
      success: false,
      message: '获取借阅申请列表失败'
    });
  }
});

module.exports = router; 