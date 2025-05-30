import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import path from 'path'
import { URL } from 'url'

const app = express()
const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1')
const uploadDir = path.join(__dirname, 'uploads')
import fs from 'fs'

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
let products = []
let idCounter = 1

// 允许跨域请求
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
)

// 获取所有商品
app.get('/api/products', (req, res) => {
  res.json(products)
})

// 获取单个商品详情
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const product = products.find((p) => p.id === id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: '商品不存在' })
  }
})

// 创建新商品
app.post('/api/products', async (req, res, next) => {
  try {
    if (!req.files?.image) {
      return res.status(400).json({ error: '请上传商品图片' })
    }

    const imageFile = req.files.image
    const timestamp = Date.now()
    const filename = `${timestamp}_${imageFile.name}`
    const imagePath = `/uploads/${filename}`

    await imageFile.mv(path.join(uploadDir, filename))

    const newProduct = {
      id: idCounter++,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: `http://${req.headers.host}${imagePath}`,
    }

    products.push(newProduct)
    res.json(newProduct)
  } catch (err) {
    next(err)
  }
})

// 更新商品
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = products.findIndex((p) => p.id === id)

  if (index > -1) {
    products[index] = {
      ...products[index],
      ...req.body,
    }
    res.json(products[index])
  } else {
    res.status(404).send('商品不存在')
  }
})

// 删除商品
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id)
  products = products.filter((p) => p.id !== id)
  res.sendStatus(204)
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: '服务器错误',
    message: err.message,
  })
})

// 购物车管理
let carts = {}

// 添加商品到购物车
app.post('/api/cart/items', (req, res) => {
  try {
    const { userId, productId, quantity, size, color, greeting } = req.body // Changed custom_size to size, custom_color to color, custom_greeting to greeting

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要字段',
        required: ['userId', 'productId', 'quantity'],
      })
    }

    // 检查商品是否存在
    const product = products.find((p) => p.id === parseInt(productId))
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在',
      })
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({
        code: 400,
        message: '商品库存不足',
      })
    }

    // 初始化用户购物车
    if (!carts[userId]) {
      carts[userId] = []
    }

    // 查找购物车中是否已存在该商品
    const existingItem = carts[userId].find((item) => item.productId === parseInt(productId))
    if (existingItem) {
      // 更新数量
      existingItem.quantity += quantity
      // 如果商品已存在，也应该更新其定制信息（如果提供了新的话）
      if (size) existingItem.custom_size = size // Changed custom_size to size
      if (color) existingItem.custom_color = color // Changed custom_color to color
      if (greeting) existingItem.custom_greeting = greeting // Changed custom_greeting to greeting
    } else {
      // 添加新商品
      carts[userId].push({
        productId: parseInt(productId),
        quantity: quantity,
        name: product.name,
        price: product.price,
        image: product.image,
        custom_size: size, // Changed custom_size to size
        custom_color: color, // Changed custom_color to color
        custom_greeting: greeting, // Changed custom_greeting to greeting
      })
    }

    res.status(200).json({
      code: 200,
      message: '添加成功',
      data: carts[userId],
    })
  } catch (err) {
    console.error('添加购物车失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 获取购物车列表
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId
  res.json({
    code: 200,
    data: carts[userId] || [],
  })
})

// 清空购物车
app.delete('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId
  carts[userId] = []
  res.status(200).json({
    code: 200,
    message: '购物车已清空',
  })
})

// 订单管理
// 注意：orders和orderIdCounter已在下方定义，此处仅保留注释

// 删除购物车中的商品
app.delete('/api/cart/:userId/items/:productId', (req, res) => {
  const userId = req.params.userId
  const productId = parseInt(req.params.productId)

  if (!carts[userId]) {
    return res.status(404).json({
      code: 404,
      message: '购物车不存在',
    })
  }

  carts[userId] = carts[userId].filter((item) => item.productId !== productId)
  res.status(200).json({
    code: 200,
    message: '商品已从购物车中移除',
    data: carts[userId],
  })
})

// 更新购物车商品数量
app.put('/api/cart/:userId/items/:productId', (req, res) => {
  try {
    const userId = req.params.userId
    const productId = parseInt(req.params.productId)
    const { quantity } = req.body

    if (!carts[userId]) {
      return res.status(404).json({
        code: 404,
        message: '购物车不存在',
      })
    }

    const cartItem = carts[userId].find((item) => item.productId === productId)
    if (!cartItem) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在于购物车中',
      })
    }

    // 检查商品库存
    const product = products.find((p) => p.id === productId)
    if (!product || product.stock < quantity) {
      return res.status(400).json({
        code: 400,
        message: '商品库存不足',
      })
    }

    cartItem.quantity = quantity
    res.status(200).json({
      code: 200,
      message: '数量更新成功',
      data: carts[userId],
    })
  } catch (err) {
    console.error('更新购物车失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 添加用户管理接口
let users = []
let userIdCounter = 1

// 创建用户接口
app.post('/api/users', async (req, res) => {
  try {
    const newUser = {
      id: userIdCounter++,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      created_at: new Date().toISOString(),
    }

    // 字段验证
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要字段',
        required: ['username', 'password', 'email'],
      })
    }

    users.push(newUser)
    res.status(201).json({
      code: 201,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    })
  } catch (err) {
    console.error('用户创建失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 获取用户列表接口
app.get('/api/users', (req, res) => {
  res.json({ users })
})

// 用户注册接口
// 用户登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空',
      })
    }

    let user = users.find((u) => u.username === username)

    if (!user) {
      // 自动注册逻辑
      const newUser = {
        id: userIdCounter++,
        username,
        password,
        email: req.body.email || '',
        created_at: new Date().toISOString(),
      }

      users.push(newUser)
      user = newUser
    }

    if (user.password !== password) {
      return res.status(401).json({
        code: 401,
        message: '密码错误',
      })
    }

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock_jwt_token',
        userId: user.id,
      },
    })
  } catch (err) {
    console.error('登录失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
    })
  }
})

// 用户注册接口
app.post('/api/register', (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password || !email) {
      return res.status(400).json({
        code: 400,
        message: '用户名、密码和邮箱不能为空',
      })
    }

    const userExists = users.some((u) => u.username === username)
    if (userExists) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在',
      })
    }

    const newUser = {
      id: userIdCounter++,
      username,
      password,
      email,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    })
  } catch (err) {
    console.error('注册失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 删除用户接口
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: '用户不存在',
    })
  }

  users.splice(index, 1)
  res.status(200).json({
    code: 200,
    message: '用户删除成功',
  })
})

// 更新用户信息接口
app.put('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const index = users.findIndex((user) => user.id === id)

    if (index === -1) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
      })
    }

    // 用户信息更新逻辑

    // 验证更新字段
    const { username, email, password } = req.body
    if (!username && !email && !password) {
      return res.status(400).json({
        code: 400,
        message: '至少需要提供一个要更新的字段',
        updateable: ['username', 'email', 'password'],
      })
    }

    // 更新用户信息
    users[index] = {
      ...users[index],
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }),
      updated_at: new Date().toISOString(),
    }

    // 返回更新后的用户信息（不包含密码）
    res.status(200).json({
      code: 200,
      message: '用户信息更新成功',
    })
  } catch (err) {
    console.error('更新用户信息失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 订单管理相关接口
let orders = []
let orderIdCounter = 1

// 订单管理相关接口
// 获取订单列表
app.get('/api/orders', (req, res) => {
  res.json({
    code: 200,
    data: {
      orders: orders,
    },
  })
})

// 获取订单详情
app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return res.status(404).json({
      code: 404,
      message: '订单不存在',
    })
  }

  res.json({
    code: 200,
    data: order,
  })
})

// 创建订单
app.post('/api/orders', (req, res) => {
  try {
    const { user_id, address, phone, total_amount, custom_size, custom_color, custom_greeting } =
      req.body

    // 字段验证
    if (!user_id || !address || !phone || !total_amount) {
      return res.status(400).json({
        code: 400,
        message: '缺少必要字段',
        required: ['user_id', 'address', 'phone', 'total_amount'],
      })
    }

    // 获取购物车商品
    const cartItems = carts[user_id]
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        code: 400,
        message: '购物车为空，无法创建订单',
      })
    }

    const newOrder = {
      id: orderIdCounter++,
      user_id,
      address,
      phone,
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        custom_size: item.custom_size, // 从购物车项目中获取
        custom_color: item.custom_color, // 从购物车项目中获取
        custom_greeting: item.custom_greeting, // 从购物车项目中获取
      })),
      total_amount,
      status: '待发货',
      created_at: new Date().toISOString(),
      createTime: new Date().toLocaleString(),
      totalPrice: total_amount,
      // 将定制信息也存储在订单级别，如果需要的话
      // custom_size,
      // custom_color,
      // custom_greeting
    }

    orders.push(newOrder)
    // 清空购物车
    carts[user_id] = []
    res.status(201).json({
      code: 201,
      message: '订单创建成功',
      data: newOrder,
    })
  } catch (err) {
    console.error('订单创建失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 更新订单
app.put('/api/orders/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const index = orders.findIndex((o) => o.id === id)

    if (index === -1) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在',
      })
    }

    const {
      address,
      phone,
      status,
      items,
      total_amount,
      custom_size,
      custom_color,
      custom_greeting,
    } = req.body

    // 验证订单状态的有效性
    const validStatuses = ['待付款', '已付款', '已发货', '已完成', '已取消']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        code: 400,
        message: '无效的订单状态',
        validStatuses,
      })
    }

    const updatedOrder = {
      ...orders[index],
      ...(address && { address }),
      ...(phone && { phone }),
      ...(status && { status }),
      ...(items && { items }), // items 内部应该也包含定制信息
      ...(total_amount && { total_amount }),
      // 如果订单级别也存储定制信息，则更新
      // ...(custom_size && { custom_size }),
      // ...(custom_color && { custom_color }),
      // ...(custom_greeting && { custom_greeting }),
      updated_at: new Date().toISOString(),
    }

    orders[index] = updatedOrder
    res.status(200).json({
      code: 200,
      message: '订单更新成功',
      data: {
        ...updatedOrder,
        status: updatedOrder.status,
      },
    })
  } catch (err) {
    console.error('更新订单失败:', err)
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      error: err.message,
    })
  }
})

// 删除订单
app.delete('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = orders.findIndex((o) => o.id === id)

  if (index === -1) {
    return res.status(404).json({
      code: 404,
      message: '订单不存在',
    })
  }

  orders.splice(index, 1)
  res.status(200).json({
    code: 200,
    message: '订单删除成功',
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`)
})
