<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../mock/api'

const emit = defineEmits(['login-success', 'close'])
const isLogin = ref(true)
const form = ref({
  username: '',
  password: '',
  email: '',
})
const error = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const showUnregisteredModal = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    if (isLogin.value) {
      const res = await authAPI.login({
        username: form.value.username,
        password: form.value.password,
      })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      emit('login-success')

      // 保留购物车跳转逻辑
      if (route.path === '/cart') {
        router.push('/cart')
      } else {
        router.push('/')
      }
    } else {
      const res = await authAPI.register(form.value)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      emit('login-success')
      router.push('/')
    }
  } catch (err) {
    if (err.message.includes('用户不存在')) {
      // 自动注册并跳转到首页
      const res = await authAPI.register(form.value)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      emit('login-success')
      router.push('/')
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <!-- 毛玻璃背景 -->
    <div class="absolute inset-0 backdrop-blur-sm bg-black/30" @click="$emit('close')"></div>

    <!-- 登录框 -->
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8">
      <!-- 关闭按钮 -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ isLogin ? '登录' : '注册' }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">用户名：</label>
          <input
            type="text"
            v-model="form.username"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">密码：</label>
          <input
            type="password"
            v-model="form.password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div v-if="!isLogin" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">邮箱：</label>
          <input
            type="email"
            v-model="form.email"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :disabled="loading"
          @click.prevent="handleSubmit"
        >
          <span v-if="loading" class="inline-block mr-2">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          {{ isLogin ? '登录' : '注册' }}
        </button>

        <div class="text-center text-sm">
          <a
            href="#"
            @click.prevent="isLogin = !isLogin"
            class="text-indigo-600 hover:text-indigo-800"
          >
            {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
          </a>
        </div>
      </form>

      <!-- 未注册提示框 -->
      <div v-if="showUnregisteredModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="absolute inset-0 bg-black/30" @click="showUnregisteredModal = false"></div>
        <div class="relative bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold mb-4">账号未注册</h3>
          <p class="text-gray-600 mb-6">检测到该账号尚未注册，请完成注册流程</p>
          <button
            @click="showUnregisteredModal = false"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
