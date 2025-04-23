<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../mock/api'

const router = useRouter()
const isLogin = ref(true)
const form = ref({
  username: '',
  password: '',
  email: '',
})
const error = ref('')

const handleSubmit = async () => {
  try {
    error.value = ''
    if (isLogin.value) {
      const res = await authAPI.login({
        username: form.value.username,
        password: form.value.password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      router.push('/')
    } else {
      await authAPI.register(form.value)
      isLogin.value = true
    }
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? '登录' : '注册' }}</h2>
    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label>用户名：</label>
        <input type="text" v-model="form.username" required />
      </div>

      <div class="form-group">
        <label>密码：</label>
        <input type="password" v-model="form.password" required />
      </div>

      <div v-if="!isLogin" class="form-group">
        <label>邮箱：</label>
        <input type="email" v-model="form.email" required />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="submit-btn">
        {{ isLogin ? '登录' : '注册' }}
      </button>

      <div class="switch-mode">
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
        </a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 500;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.error-message {
  color: #ff4444;
  font-size: 14px;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}

.switch-mode {
  text-align: center;
}

.switch-mode a {
  color: #2c3e50;
  text-decoration: none;
}

.switch-mode a:hover {
  text-decoration: underline;
}
</style>
