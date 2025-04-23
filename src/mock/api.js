// Mock API服务
import { users, products, orders, cart } from './data'

// 用户认证API
export const authAPI = {
  // 用户注册
  register: (userData) => {
    const user = {
      id: String(users.length + 1),
      ...userData,
    }
    users.push(user)
    return {
      code: 200,
      message: '注册成功',
      data: {
        userId: user.id,
        username: user.username,
      },
    }
  },

  // 用户登录
  login: (credentials) => {
    const user = users.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )
    if (user) {
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock_token_' + user.id,
          userId: user.id,
          username: user.username,
        },
      }
    }
    throw new Error('用户名或密码错误')
  },
}

// 商品API
export const productAPI = {
  // 获取商品列表
  getProducts: (page = 1, size = 10) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      code: 200,
      data: {
        total: products.length,
        items: products.slice(start, end),
      },
    }
  },

  // 获取商品详情
  getProductById: (id) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      return {
        code: 200,
        data: product,
      }
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
