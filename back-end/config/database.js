const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
  host: '123.249.11.249',  // 使用公网地址
  user: 'root',            // 用户名
  password: 'Lib112233',    // 密码
  database: 'library',     // 数据库名
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,    // 增加连接超时时间到60秒
  acquireTimeout: 60000,    // 增加获取连接超时时间
  timeout: 60000,          // 增加查询超时时间
  enableKeepAlive: true,   // 启用keepalive
  keepAliveInitialDelay: 10000  // keepalive初始延迟
});

// 获取promise包装器
const promisePool = pool.promise();

// 测试连接
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('数据库连接丢失');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('数据库连接数过多');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('数据库连接被拒绝');
    }
    if (err.code === 'ENOTFOUND') {
      console.error('找不到数据库主机');
    }
    console.error('连接数据库时出错:', err);
    return;
  }
  
  if (connection) {
    console.log('成功连接到数据库');
    connection.release();
  }
});

module.exports = promisePool; 