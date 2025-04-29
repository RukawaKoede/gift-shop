// ... existing code ...
async fetchProducts() {
  try {
    const response = await axios.get('/api/products')
    if (response.data.code === 200) {
      this.products = response.data.data.items
    } else {
      console.error('API返回异常:', response.data.message)
    }
  } catch (error) {
    console.error('请求失败:', error)
    if (error.response) {
      console.error('HTTP状态码:', error.response.status)
      console.error('响应数据:', error.response.data)
    }
  }
},
// ... existing code ...