# 电商网站API接口规范

## 用户认证模块

### 1. 用户注册

- 请求方法：POST
- 接口路径：/api/auth/register
- 请求参数：

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

- 响应数据：

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "string",
    "username": "string"
  }
}
```

### 2. 用户登录

- 请求方法：POST
- 接口路径：/api/auth/login
- 请求参数：

```json
{
  "username": "string",
  "password": "string"
}
```

- 响应数据：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "userId": "string",
    "username": "string"
  }
}
```

## 商品模块

### 1. 获取商品列表

- 请求方法：GET
- 接口路径：/api/products
- 请求参数：
  - page: 页码（默认1）
  - size: 每页数量（默认10）
- 响应数据：

```json
{
  "code": 200,
  "data": {
    "total": 100,
    "items": [
      {
        "id": "string",
        "name": "string",
        "price": 99.99,
        "description": "string",
        "image": "string",
        "stock": 100
      }
    ]
  }
}
```

### 2. 获取商品详情

- 请求方法：GET
- 接口路径：/api/products/{id}
- 响应数据：

```json
{
  "code": 200,
  "data": {
    "id": "string",
    "name": "string",
    "price": 99.99,
    "description": "string",
    "image": "string",
    "stock": 100,
    "details": "string"
  }
}
```

## 购物车模块

### 1. 添加商品到购物车

- 请求方法：POST
- 接口路径：/api/cart/items
- 请求参数：

```json
{
  "productId": "string",
  "quantity": 1
}
```

- 响应数据：

```json
{
  "code": 200,
  "message": "添加成功"
}
```

### 2. 获取购物车列表

- 请求方法：GET
- 接口路径：/api/cart/items
- 响应数据：

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "string",
        "productId": "string",
        "name": "string",
        "price": 99.99,
        "quantity": 1,
        "image": "string"
      }
    ],
    "totalPrice": 99.99
  }
}
```

## 订单模块

### 1. 创建订单

- 请求方法：POST
- 接口路径：/api/orders
- 请求参数：

```json
{
  "cartItems": ["string"],
  "address": "string",
  "phone": "string"
}
```

- 响应数据：

```json
{
  "code": 200,
  "data": {
    "orderId": "string",
    "totalPrice": 99.99
  }
}
```

### 2. 获取订单列表

- 请求方法：GET
- 接口路径：/api/orders
- 响应数据：

```json
{
  "code": 200,
  "data": {
    "orders": [
      {
        "id": "string",
        "status": "string",
        "createTime": "string",
        "totalPrice": 99.99,
        "items": [
          {
            "productId": "string",
            "name": "string",
            "price": 99.99,
            "quantity": 1,
            "image": "string"
          }
        ]
      }
    ]
  }
}
```
