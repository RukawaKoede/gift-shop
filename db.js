// 模拟数据库连接模块

// 模拟数据存储
const db = {
  products: [],
  users: [],
  carts: {},
  orders: [],
  counters: {
    product: 1,
    user: 1,
    order: 1
  }
};

// 模拟连接函数
const connect = () => {
  console.log('模拟数据库连接成功');
  return Promise.resolve(true);
};

// 模拟断开连接
const disconnect = () => {
  console.log('模拟数据库连接已关闭');
  return Promise.resolve(true);
};

// 导出模拟数据库对象和连接方法
module.exports = {
  connect,
  disconnect,
  db
};