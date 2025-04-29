<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '../mock/api'

const router = useRouter()
const featuredProducts = ref([])
const loading = ref(false)
const error = ref('')

const loadFeaturedProducts = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('http://localhost:3001/api/products?isFeatured=true')
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    featuredProducts.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const viewProductDetail = (productId) => {
  router.push(`/products/${productId}`)
}

onMounted(() => {
  loadFeaturedProducts()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 主要内容区域 -->
    <main class="flex-grow">
      <!-- Hero区域 -->
      <section class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div class="w-[1200px] mx-auto px-8 text-center">
          <h1 class="text-5xl font-bold mb-4">欢迎来到礼品商城</h1>
          <p class="text-xl mb-8">发现精选好物，享受品质生活</p>
          <button
            @click="router.push('/products')"
            class="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors duration-300"
          >
            浏览商品
          </button>
        </div>
      </section>

      <!-- 精选商品区域 -->
      <section class="w-[1200px] mx-auto px-8 py-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">精选商品</h2>

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

        <!-- 商品网格 -->
        <div v-else class="grid grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            @click="viewProductDetail(product.id)"
          >
            <div class="aspect-w-3 aspect-h-2 overflow-hidden">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
              <p class="text-xl font-bold text-red-600">¥{{ product.price }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="w-[1200px] mx-auto px-8 py-12 bg-gray-50">
        <div class="grid grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">品质保证</h3>
            <p class="text-gray-600">精选优质商品，严格品控把关</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">快速配送</h3>
            <p class="text-gray-600">全国配送，便捷快速</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">售后无忧</h3>
            <p class="text-gray-600">7天无理由退换，购物无忧</p>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部区域 -->
    <footer class="bg-gray-100 mt-auto py-6 border-t border-gray-200">
      <div class="w-[1200px] mx-auto px-8">
        <p class="text-center text-gray-500 text-sm">© 2024 礼品商店. 保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
