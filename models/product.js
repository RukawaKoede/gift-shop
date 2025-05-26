// 产品模型
const { db } = require('../db');

// 获取所有产品
const findAll = () => {
  return Promise.resolve(db.products);
};

// 根据ID查找产品
const findById = (id) => {
  const product = db.products.find(p => p.id === id);
  return Promise.resolve(product || null);
};

// 创建新产品
const create = (productData) => {
  const newProduct = {
    id: db.counters.product++,
    ...productData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  db.products.push(newProduct);
  return Promise.resolve(newProduct);
};

// 更新产品
const update = (id, productData) => {
  const index = db.products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  db.products[index] = {
    ...db.products[index],
    ...productData,
    updated_at: new Date().toISOString()
  };
  
  return Promise.resolve(db.products[index]);
};

// 删除产品
const remove = (id) => {
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== id);
  
  return Promise.resolve(initialLength !== db.products.length);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};