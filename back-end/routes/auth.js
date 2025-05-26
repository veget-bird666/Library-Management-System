const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, isAdmin } = req.body;
        
        // 密码加密
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 选择表名
        const tableName = isAdmin ? 'admins' : 'users';
        
        // 检查邮箱是否已存在
        const [existingUsers] = await db.execute(
            `SELECT * FROM ${tableName} WHERE email = ?`,
            [email]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: '该邮箱已被注册' });
        }
        
        // 插入新用户
        const [result] = await db.execute(
            `INSERT INTO ${tableName} (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );
        
        res.status(201).json({
            message: '注册成功',
            userId: result.insertId
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '注册失败，请稍后重试' });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { email, password, isAdmin } = req.body;
        
        // 选择表名
        const tableName = isAdmin ? 'admins' : 'users';
        
        // 查询用户
        const [users] = await db.execute(
            `SELECT * FROM ${tableName} WHERE email = ?`,
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: '邮箱或密码错误' });
        }
        
        const user = users[0];
        
        // 验证密码
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: '邮箱或密码错误' });
        }
        
        // 返回用户信息（不包含密码）
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: '登录成功',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '登录失败，请稍后重试' });
    }
});

module.exports = router; 