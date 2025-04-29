<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">商品管理</h2>
        <button
          @click="showAddForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          添加商品
        </button>
      </div>

      <!-- 商品列表 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                名称
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                价格
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                库存
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                图片
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                ¥{{ product.price }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <img
                  v-if="product.image"
                  :src="product.image"
                  class="max-w-[60px] h-auto rounded"
                  alt="商品图片"
                />
                <span v-else class="text-gray-400">暂无图片</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="editProduct(product)" class="text-indigo-600 hover:text-indigo-900">
                  编辑
                </button>
                <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 添加/编辑商品表单 -->
      <div
        v-if="showAddForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            {{ editingProduct ? '编辑商品' : '添加商品' }}
          </h3>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
              <input
                v-model="productForm.name"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">价格</label>
              <input
                type="number"
                v-model="productForm.price"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">库存</label>
              <input
                type="number"
                v-model="productForm.stock"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">图片</label>
              <input
                type="file"
                @change="handleFileUpload"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showAddForm = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const showAddForm = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  image: '',
})

// 获取商品列表
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/products')
    products.value = await response.json()
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

// 编辑商品
const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showAddForm.value = true
}

// 删除商品
const deleteProduct = async (id) => {
  if (!confirm('确定要删除这个商品吗？')) return
  try {
    await fetch(`http://localhost:3001/api/products/${id}`, { method: 'DELETE' })
    await fetchProducts()
  } catch (error) {
    console.error('删除商品失败:', error)
  }
}

// 修改保存商品方法
const saveProduct = async () => {
  try {
    const formData = new FormData()
    formData.append('name', productForm.value.name)
    formData.append('description', productForm.value.description)
    formData.append('price', productForm.value.price)
    formData.append('stock', productForm.value.stock)

    if (productForm.value.image) {
      const blob = await fetch(productForm.value.image).then((r) => r.blob())
      formData.append('image', blob, 'product-image.jpg')
    }

    const method = editingProduct.value ? 'PUT' : 'POST'
    const url = editingProduct.value
      ? `http://localhost:3001/api/products/${editingProduct.value.id}`
      : 'http://localhost:3001/api/products'

    const response = await fetch(url, {
      method,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP错误 ${response.status}: ${errorData}`)
    }

    await fetchProducts()
    showAddForm.value = false
  } catch (error) {
    console.error('保存失败详情:', error)
    console.error('请求配置:', {
      url: url,
      method: method,
    })
    alert(`保存失败: ${error.message}`)
  }
}

onMounted(() => {
  fetchProducts()
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.product-management {
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.product-table th {
  background-color: #f5f5f5;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #34495e;
}
.sidebar {
  background-color: #f0f0f0;
  color: #333;
  font-size: 16px;
}
</style>
