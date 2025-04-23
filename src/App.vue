<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthModal from './components/AuthModal.vue'

const isLoggedIn = ref(false)
const showAuthModal = ref(false)

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  showAuthModal.value = false
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  isLoggedIn.value = false
}

onMounted(() => {
  // 检查是否已登录
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
  }
})

const router = useRouter()

// 添加路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/cart' && !isLoggedIn.value) {
    showAuthModal.value = true
    next(false)
  } else {
    next()
  }
})
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

.nav-link {
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #4f46e5;
  background-color: #f3f4f6;
}

nav a.router-link-exact-active {
  color: #4f46e5;
  background-color: #eef2ff;
}

nav a.router-link-exact-active:hover {
  background-color: #e0e7ff;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <RouterLink to="/" class="text-xl font-bold text-indigo-600">礼品商城</RouterLink>
          <div class="flex items-center space-x-4">
            <RouterLink to="/" class="nav-link">首页</RouterLink>
            <RouterLink to="/products" class="nav-link">商品列表</RouterLink>
            <RouterLink to="/cart" class="nav-link">购物车</RouterLink>
            <template v-if="isLoggedIn">
              <RouterLink to="/orders" class="nav-link">我的订单</RouterLink>
              <a href="#" @click.prevent="logout" class="nav-link">退出登录</a>
            </template>
            <template v-else>
              <a href="#" @click.prevent="showAuthModal = true" class="nav-link">登录/注册</a>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- 路由视图 -->
    <RouterView />

    <!-- 登录/注册模态窗口 -->
    <AuthModal
      v-if="showAuthModal"
      @login-success="handleLoginSuccess"
      @close="showAuthModal = false"
    />
  </div>
</template>
