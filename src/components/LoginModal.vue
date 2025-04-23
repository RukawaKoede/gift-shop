<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../mock/api'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'login-success'])

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
      emit('login-success')
      resetForm()
    } else {
      await authAPI.register(form.value)
      isLogin.value = true
    }
  } catch (err) {
    error.value = err.message
  }
}

const resetForm = () => {
  form.value = {
    username: '',
    password: '',
    email: '',
  }
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

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
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background-color: white;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
