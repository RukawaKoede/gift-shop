<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartAPI, orderAPI } from '../mock/api'

const router = useRouter()
const cart = ref({ items: [], totalPrice: 0 })
const loading = ref(false)
const error = ref('')
const orderForm = ref({
  address: '',
  phone: '',
})
const showOrderForm = ref(false)

const loadCart = async () => {
  try {
    loading.value = true
    error.value = ''
    const res = await cartAPI.getCart()
    cart.value = res.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const createOrder = async () => {
  try {
    loading.value = true
    error.value = ''
    await orderAPI.createOrder({
      ...orderForm.value,
      cartItems: cart.value.items.map((item) => item.id),
    })
    router.push('/orders')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <main class="flex-grow">
      <section class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div class="w-[1200px] mx-auto px-8 text-center">
          <h1 class="text-5xl font-bold mb-4">购物车</h1>
          <p class="text-xl mb-8">查看已选商品，完成订单结算</p>
        </div>
      </section>

      <section class="w-[1200px] mx-auto px-8 py-12">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <span class="ml-3 text-lg text-gray-600">加载中...</span>
        </div>

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

        <div v-else>
          <div v-if="cart.items.length === 0" class="text-center py-12">
            <h3 class="text-xl font-medium text-gray-900 mb-4">购物车是空的</h3>
            <button
              @click="router.push('/products')"
              class="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
            >
              去购物
            </button>
          </div>

          <div v-else>
            <!-- 购物车商品列表 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">已选商品</h2>
                <div class="space-y-6">
                  <div
                    v-for="item in cart.items"
                    :key="item.id"
                    class="flex items-center py-6 border-b border-gray-200 last:border-b-0"
                  >
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-24 h-24 object-cover rounded-lg"
                    />
                    <div class="flex-grow ml-6">
                      <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                      <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
                      <div class="flex items-center justify-between mt-4">
                        <p class="text-xl font-bold text-red-600">¥{{ item.price }}</p>
                        <div class="flex items-center space-x-4">
                          <button
                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                            @click="updateQuantity(item.id, item.quantity - 1)"
                            :disabled="item.quantity <= 1"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span class="text-gray-900 font-medium">{{ item.quantity }}</span>
                          <button
                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                            @click="updateQuantity(item.id, item.quantity + 1)"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      @click="removeFromCart(item.id)"
                      class="ml-6 text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 结算区域 -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="p-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">订单结算</h2>
                <div class="space-y-4">
                  <div class="flex justify-between items-center text-lg">
                    <span class="text-gray-600">商品总价</span>
                    <span class="font-bold text-gray-900">¥{{ cart.totalPrice }}</span>
                  </div>
                  <div class="pt-4 border-t border-gray-200">
                    <button
                      @click="showOrderForm = true"
                      class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      立即结算
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 订单表单弹窗 -->
            <div
              v-if="showOrderForm"
              class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">填写订单信息</h3>
                <form @submit.prevent="createOrder" class="space-y-6">
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700 mb-2"
                      >收货地址</label
                    >
                    <input
                      type="text"
                      id="address"
                      v-model="orderForm.address"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2"
                      >联系电话</label
                    >
                    <input
                      type="tel"
                      id="phone"
                      v-model="orderForm.phone"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div class="flex justify-end space-x-4">
                    <button
                      type="button"
                      @click="showOrderForm = false"
                      class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      提交订单
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部区域 -->
    <footer class="bg-gray-100 mt-auto py-6 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">© 2024 礼品商店. 保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.submit-btn {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 20px;
}
</style>
