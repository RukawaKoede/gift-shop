<script setup>
import { ref, onMounted } from 'vue'
import { orderAPI } from '../mock/api'

const orders = ref([])
const loading = ref(false)
const error = ref('')

const loadOrders = async () => {
  try {
    loading.value = true
    error.value = ''
    const res = await orderAPI.getOrders()
    orders.value = res.data.orders
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <main class="flex-grow">
      <section class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div class="w-[1200px] mx-auto px-8 text-center">
          <h1 class="text-5xl font-bold mb-4">我的订单</h1>
          <p class="text-xl mb-8">查看订单详情和配送状态</p>
        </div>
      </section>

      <section class="w-[1200px] mx-auto px-8 py-12">
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
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- 空订单提示 -->
        <div v-else-if="orders.length === 0" class="text-center py-12">
          <h3 class="text-xl font-medium text-gray-900 mb-4">暂无订单</h3>
          <button
            @click="router.push('/products')"
            class="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            去购物
          </button>
        </div>

        <!-- 订单列表 -->
        <div v-else class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span class="text-gray-600">订单号：{{ order.id }}</span>
              <span class="text-green-600 font-medium">{{ order.status }}</span>
            </div>

            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="item in order.items"
                  :key="item.productId"
                  class="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded-lg"
                  />
                  <div class="flex-grow">
                    <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                    <p class="text-red-600 font-medium mt-1">¥{{ item.price }}</p>
                    <p class="text-gray-500 mt-1">数量: {{ item.quantity }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span class="text-gray-600">下单时间：{{ order.createTime }}</span>
              <span class="text-lg font-medium text-gray-900">总计：¥{{ order.totalPrice }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 移除所有原有样式，使用 Tailwind CSS 类替代 */
</style>
