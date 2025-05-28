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
        if (isAdmin) {
            // 管理员注册
            const [existingAdmins] = await db.execute(
                'SELECT * FROM admin WHERE admin_account = ?',
                [email]
            );
            
            if (existingAdmins.length > 0) {
                return res.status(400).json({ message: '该账号已被注册' });
            }
            
            const [result] = await db.execute(
                'INSERT INTO admin (admin_account, admin_password, admin_nickname) VALUES (?, ?, ?)',
                [email, hashedPassword, username]
            );
            
            res.status(201).json({
                message: '管理员注册成功',
                adminAccount: email
            });
        } else {
            // 普通用户注册
            const [existingUsers] = await db.execute(
                'SELECT * FROM user WHERE user_account = ?',
                [email]
            );
            
            if (existingUsers.length > 0) {
                return res.status(400).json({ message: '该账号已被注册' });
            }
            
            // 随机分配管理员
            const [admins] = await db.execute('SELECT admin_account FROM admin');
            if (admins.length === 0) {
                return res.status(400).json({ message: '系统暂无可用的管理员账号' });
            }
            
            const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
            
            const [result] = await db.execute(
                'INSERT INTO user (user_account, user_password, nickname, admin_account) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, username, randomAdmin.admin_account]
            );
            
            res.status(201).json({
                message: '用户注册成功',
                userAccount: email,
                adminAccount: randomAdmin.admin_account
            });
        }



        
       
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
        if (isAdmin) {
            // 管理员登录
            const [admins] = await db.execute(
                'SELECT * FROM admin WHERE admin_account = ?',
                [email]
            );
            
            if (admins.length === 0) {
                return res.status(401).json({ message: '账号或密码错误' });
            }
            
            const admin = admins[0];
            const validPassword = await bcrypt.compare(password, admin.admin_password);
            
            if (!validPassword) {
                return res.status(401).json({ message: '账号或密码错误' });
            }
            
            const { admin_password: _, ...adminWithoutPassword } = admin;
            res.json({
                message: '登录成功',
                user: adminWithoutPassword
            });
        } else {
            // 普通用户登录
            const [users] = await db.execute(
                'SELECT * FROM user WHERE user_account = ?',
                [email]
            );
            
            if (users.length === 0) {
                return res.status(401).json({ message: '账号或密码错误' });
            }
            
            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.user_password);
            
            if (!validPassword) {
                return res.status(401).json({ message: '账号或密码错误' });
            }
            
            const { user_password: _, ...userWithoutPassword } = user;
            res.json({
                message: '登录成功',
                user: userWithoutPassword
            });
        }
        
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '登录失败，请稍后重试' });
    }
});

module.exports = router; 