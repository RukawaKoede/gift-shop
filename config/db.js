import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'your-remote-db-host.com',
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'gift_shop',
  port: process.env.DB_PORT || 3306,
  // 连接池配置
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功！');
    connection.release();
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

export { pool, testConnection };