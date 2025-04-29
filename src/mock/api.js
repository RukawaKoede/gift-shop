// Mock API服务
import { users, products, orders, cart } from './data'

// 用户认证API
import axios from 'axios'

export const authAPI = {
  register: async (userData) => {
    const response = await axios.post('http://localhost:3001/api/register', userData)
    return {
      code: 200,
      data: response.data,
    }
  },

  login: async (credentials) => {
    const response = await axios.post('http://localhost:3001/api/login', credentials)
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: response.data.token,
        userId: response.data.userId,
        username: credentials.username,
      },
    }
  },
}

// 商品API
export const productAPI = {
  getProducts: (page = 1, size = 10) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      code: 200,
      data: {
        items: products.slice(start, end).map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock, // 确保返回库存字段
          image: product.image || '/default-product.png', // 添加默认图片路径
        })),
      },
    }
  },

  createProduct: (productData) => {
    const newProduct = {
      id: String(products.length + 1),
      ...productData,
      image: productData.image || '/default-product.png', // 统一默认图片
      stock: productData.stock || 0, // 添加库存字段
    }
    products.push(newProduct)
    return {
      code: 200,
      data: newProduct,
    }
  },
  updateProduct: (id, productData) => {
    const index = products.findIndex((p) => p.id === id)
    if (index > -1) {
      products[index] = {
        ...products[index],
        ...productData,
        image: productData.image || products[index].image,
        stock: productData.stock || products[index].stock, // 保留库存字段
      }
      return { code: 200, data: products[index] }
    }
    throw new Error('商品不存在')
  },
}

// 购物车API
export const cartAPI = {
  // 添加商品到购物车
  addToCart: (item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) throw new Error('商品不存在')

    const existingItem = cart.items.find((i) => i.productId === item.productId)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      cart.items.push({
        id: String(cart.items.length + 1),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      })
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
    return {
      code: 200,
      message: '添加成功',
    }
  },

  // 获取购物车列表
  getCart: () => {
    return {
      code: 200,
      data: cart,
    }
  },
}

// 订单API
export const orderAPI = {
  // 创建订单
  createOrder: (orderData) => {
    const order = {
      id: String(orders.length + 1),
      status: '待付款',
      createTime: new Date().toISOString(),
      items: cart.items,
      totalPrice: cart.totalPrice,
      ...orderData,
    }
    orders.push(order)
    // 清空购物车
    cart.items = []
    cart.totalPrice = 0

    return {
      code: 200,
      data: {
        orderId: order.id,
        totalPrice: order.totalPrice,
      },
    }
  },

  // 获取订单列表
  getOrders: () => {
    return {
      code: 200,
      data: {
        orders,
      },
    }
  },
}

export const userAPI = {
  getUsers: async () => {
    const newUser = {
      id: String(users.length + 1),
      ...userData,
    }
    users.push(newUser) // 修复变量名错误
    return {
      code: 200,
      data: {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    }
  },

  // 用户登录
  login: (credentials) => {
    const foundUser = users.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )
    if (foundUser) {
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock_token_' + foundUser.id,
          userId: foundUser.id,
          username: foundUser.username,
        },
      }
    }
    throw new Error('用户名或密码错误')
  },
  createUser: async (userData) => {
    const newUser = {
      id: String(users.length + 1),
      ...userData,
      created_at: new Date().toISOString(),
    }
    users.push(newUser)
    return {
      code: 200,
      data: {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    }
  },
  deleteUser: async (userId) => {
    const newUser = {
      id: String(users.length + 1),
      ...userData,
    }
    users.push(user)
    return {
      code: 200,
      data: {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    }
  },
}
