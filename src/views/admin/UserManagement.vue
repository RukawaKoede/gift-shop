<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">用户管理</h2>
        <button
          @click="showAddForm = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          添加用户
        </button>
      </div>

      <!-- 用户列表 -->
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
                用户名
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                邮箱
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                注册时间
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900">
                  编辑
                </button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 编辑用户表单 -->
      <div
        v-if="showEditForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">编辑用户</h3>
          <form @submit.prevent="updateUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                v-model="editingUser.username"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                v-model="editingUser.email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="showEditForm = false"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加用户表单 -->
    <div
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">添加用户</h3>
        <form @submit.prevent="addUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              v-model="newUser.username"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              v-model="newUser.password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input
              type="email"
              v-model="newUser.email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="showAddForm = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const showAddForm = ref(false)
const showEditForm = ref(false)
const selectedUser = ref(null)
const editingUser = ref({
  id: '',
  username: '',
  email: '',
})
const newUser = ref({
  username: '',
  password: '',
  email: '',
  created_at: new Date().toISOString(),
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 获取用户列表
const loadUsers = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/users')
    if (!response.ok) {
      throw new Error(`HTTP错误 ${response.status}`)
    }
    const data = await response.json()
    users.value = data.users
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

onMounted(async () => {
  await loadUsers()
})

// 添加用户
const addUser = async () => {
  try {
    const formData = new FormData()
    formData.append('username', newUser.value.username)
    formData.append('password', newUser.value.password)
    formData.append('email', newUser.value.email)

    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP错误 ${response.status}: ${errorData}`)
    }

    await loadUsers()
    showAddForm.value = false
    // 重置表单
    newUser.value = {
      username: '',
      password: '',
      email: '',
      created_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error('保存失败详情:', error)
    console.error('请求配置:', {
      url: 'http://localhost:3001/api/users',
      method: 'POST',
    })
    alert(`保存失败: ${error.message}`)
  }
}

// 编辑用户
const editUser = (user) => {
  editingUser.value = {
    id: user.id,
    username: user.username,
    email: user.email,
  }
  showEditForm.value = true
}

// 更新用户
const updateUser = async () => {
  try {
    const formData = new FormData()
    formData.append('username', editingUser.value.username)
    formData.append('email', editingUser.value.email)

    const url = `http://localhost:3001/api/users/${editingUser.value.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP错误 ${response.status}: ${errorData}`)
    }

    const result = await response.json()
    if (result.code !== 200) {
      throw new Error(result.message || '更新失败')
    }

    await loadUsers()
    showEditForm.value = false
  } catch (error) {
    console.error('更新用户失败:', error)
    alert(`更新失败: ${error.message}`)
  }
}

// 删除用户
const deleteUser = async (userId) => {
  if (!confirm('确定要删除这个用户吗？')) return
  try {
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = '删除失败'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        const errorText = await response.text()
        errorMessage = errorText || `HTTP错误 ${response.status}`
      }
      throw new Error(errorMessage)
    }

    await loadUsers()
  } catch (error) {
    console.error('删除用户失败:', error)
    alert(`删除失败: ${error.message}`)
  }
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.user-table,
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th,
.user-table td,
.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-table th,
.order-table th {
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
  width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-actions {
  margin-top: 20px;
  text-align: right;
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
</style>
