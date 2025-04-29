<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <!-- <nav class="bg-white shadow-sm">
      <div class="max-w-[1200px] mx-auto px-4">
        <div class="flex items-center h-16">
          <router-link to="/" class="text-emerald-500 text-xl font-bold">礼品商城</router-link>
          <div class="ml-8 space-x-4">
            <router-link to="/" class="text-gray-600 hover:text-gray-900">首页</router-link>
            <router-link to="/products" class="text-gray-600 hover:text-gray-900"
              >商品列表</router-link
            >
            <router-link to="/cart" class="text-gray-600 hover:text-gray-900">购物车</router-link>
            <router-link to="/login" class="text-gray-600 hover:text-gray-900"
              >登录/注册</router-link
            >
          </div>
        </div>
      </div>
    </nav> -->

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- 侧边栏 -->
      <div class="w-64 bg-gradient-to-b from-blue-500 to-indigo-600 text-white flex-shrink-0">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-center mb-8">后台管理</h2>
          <nav class="space-y-2">
            <router-link
              to="/admin/products"
              class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              :class="{ 'bg-white/20': $route.path.includes('/products') }"
            >
              商品管理
            </router-link>
            <router-link
              to="/admin/orders"
              class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              :class="{ 'bg-white/20': $route.path.includes('/orders') }"
            >
              订单管理
            </router-link>
            <router-link
              to="/admin/users"
              class="block px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              :class="{ 'bg-white/20': $route.path.includes('/users') }"
            >
              用户管理
            </router-link>
          </nav>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex-1 overflow-auto bg-gray-100">
        <div class="w-[1200px] mx-auto p-8">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.admin-sidebar h2 {
  margin-bottom: 20px;
  text-align: center;
}

.admin-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-sidebar a {
  color: white;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
}

.admin-sidebar a:hover {
  background-color: #34495e;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}
</style>
