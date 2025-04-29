<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const quantity = ref(1)
const loading = ref(false)
const error = ref('')
const addingToCart = ref(false)
const activeImageIndex = ref(0)
const selectedSize = ref('M') // 默认选择中号
const selectedColor = ref('黑色') // 默认选择黑色
const customGreeting = ref('') // 定制祝福语
const availableSizes = ref(['S', 'M', 'L'])
const availableColors = ref(['黑色', '白色', '红色', '蓝色'])

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch(`http://localhost:3001/api/products/${route.params.id}`)
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    product.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  try {
    addingToCart.value = true
    error.value = ''

    // 验证必要字段
    if (!product.value || !product.value.id) {
      throw new Error('商品信息不完整')
    }

    if (!quantity.value || quantity.value <= 0) {
      throw new Error('请选择有效的商品数量')
    }

    // 调用添加到购物车API
    const response = await fetch('http://localhost:3001/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 1, // 使用固定的用户ID
        productId: Number(product.value.id),
        quantity: Number(quantity.value),
        size: selectedSize.value,
        color: selectedColor.value,
        greeting: customGreeting.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP错误 ${response.status}`)
    }

    const result = await response.json()
    if (result.code === 200) {
      // 显示成功消息
      alert('商品已成功加入购物车')
      router.push('/cart')
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <main class="flex-grow">
      <div class="w-[1200px] mx-auto px-8 py-12">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <span class="ml-3 text-lg text-gray-600">加载中...</span>
        </div>

        <!-- 错误提示 -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 my-4 rounded-r-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div v-else-if="product" class="grid grid-cols-2 gap-12">
          <!-- 商品图片 -->
          <div class="relative overflow-hidden rounded-lg shadow-lg bg-white">
            <img :src="product.image" :alt="product.name" class="w-full h-[500px] object-cover" />
          </div>

          <!-- 商品信息 -->
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            <p class="text-lg text-gray-600 mb-6">{{ product.description }}</p>
            <div class="mb-8">
              <p class="text-3xl font-bold text-red-600">¥{{ product.price }}</p>
              <p class="mt-2 text-sm text-gray-500">
                库存: {{ product.stock > 0 ? product.stock : '暂无库存' }}
              </p>
            </div>

            <!-- 购买区域 -->
            <div class="space-y-6">
              <!-- 尺寸选择 -->
              <div class="flex flex-col space-y-2">
                <span class="text-gray-700 font-medium">定制尺寸:</span>
                <div class="flex items-center space-x-3">
                  <button
                    v-for="size in availableSizes"
                    :key="size"
                    @click="selectedSize = size"
                    :class="[
                      'px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200',
                      selectedSize === size
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <!-- 颜色选择 -->
              <div class="flex flex-col space-y-2">
                <span class="text-gray-700 font-medium">定制颜色:</span>
                <div class="flex items-center space-x-3">
                  <button
                    v-for="color in availableColors"
                    :key="color"
                    @click="selectedColor = color"
                    :class="[
                      'px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200',
                      selectedColor === color
                        ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>

              <!-- 祝福语输入 -->
              <div class="flex flex-col space-y-2">
                <span class="text-gray-700 font-medium">定制祝福语:</span>
                <textarea
                  v-model="customGreeting"
                  placeholder="请输入您的祝福语..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                  rows="3"
                ></textarea>
              </div>

              <!-- 数量选择 -->
              <div class="flex items-center space-x-4">
                <span class="text-gray-700 font-medium">数量:</span>
                <div class="flex items-center border rounded-lg">
                  <button
                    @click="quantity > 1 && quantity--"
                    :disabled="quantity <= 1"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 border-x">{{ quantity }}</span>
                  <button
                    @click="quantity < product.stock && quantity++"
                    :disabled="quantity >= product.stock"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                @click="addToCart"
                :disabled="addingToCart || product.stock === 0"
                class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ addingToCart ? '添加中...' : '加入购物车' }}
              </button>
            </div>

            <!-- 商品详情 -->
            <div class="mt-12">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">商品详情</h2>
              <div class="prose prose-sm max-w-none text-gray-600">
                {{ product.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部区域 -->
    <footer class="bg-gray-100 mt-auto py-6 border-t border-gray-200">
      <div class="w-[1200px] mx-auto px-8">
        <p class="text-center text-gray-500 text-sm">© 2024 礼品商店. 保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.spec-label {
  color: #64748b;
  font-weight: 500;
}

.spec-value {
  color: #1e293b;
  font-weight: 600;
}

.stock-status {
  margin-top: 16px;
  font-size: 1.1em;
}

.in-stock {
  color: #22c55e;
  padding: 8px 16px;
  background: #f0fdf4;
  border-radius: 20px;
  display: inline-block;
}

.out-stock {
  color: #ef4444;
  padding: 8px 16px;
  background: #fef2f2;
  border-radius: 20px;
  display: inline-block;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-info h2 {
  margin: 0;
  font-size: 2em;
}

.description {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

.price {
  color: #e53935;
  font-size: 1.8em;
  font-weight: bold;
  margin: 0;
}

.stock {
  color: #666;
  font-size: 1em;
  margin: 0;
}

.details {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.details h3 {
  margin: 0 0 10px 0;
}

.purchase-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-to-cart-btn {
  flex: 1;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>
