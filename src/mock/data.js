// Mock数据

export const users = [
  {
    id: '1',
    username: 'test_user',
    email: 'test@example.com',
    password: '123456', // 实际项目中应该使用加密密码
  },
]

export const products = [
  {
    id: '1',
    name: '机械键盘',
    price: 299.99,
    description: '游戏机械键盘，青轴，RGB背光',
    image: 'https://via.placeholder.com/200x200',
    stock: 50,
    details: '104键，PBT键帽，USB接口，支持宏编程',
  },
  {
    id: '2',
    name: '无线鼠标',
    price: 129.99,
    description: '游戏无线鼠标，高精度传感器',
    image: 'https://via.placeholder.com/200x200',
    stock: 100,
    details: '16000DPI，可充电，2.4G无线连接',
  },
  {
    id: '3',
    name: '显示器',
    price: 1299.99,
    description: '27寸2K显示器，165Hz刷新率',
    image: 'https://via.placeholder.com/200x200',
    stock: 30,
    details: 'IPS面板，1ms响应时间，G-Sync兼容',
  },
  {
    id: '4',
    name: '游戏耳机',
    price: 199.99,
    description: '7.1声道游戏耳机，降噪麦克风',
    image: 'https://via.placeholder.com/200x200',
    stock: 80,
    details: '虚拟7.1声道，USB接口，RGB灯效',
  },
]

export const orders = [
  {
    id: '1',
    userId: '1',
    status: '已完成',
    createTime: '2024-01-15 14:30:00',
    totalPrice: 429.98,
    items: [
      {
        productId: '1',
        name: '机械键盘',
        price: 299.99,
        quantity: 1,
        image: 'https://via.placeholder.com/200x200',
      },
      {
        productId: '2',
        name: '无线鼠标',
        price: 129.99,
        quantity: 1,
        image: 'https://via.placeholder.com/200x200',
      },
    ],
  },
]

export const cart = {
  items: [],
  totalPrice: 0,
}
