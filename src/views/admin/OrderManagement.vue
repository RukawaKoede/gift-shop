<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">订单管理</h2>

      <!-- 订单列表 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                订单ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                用户ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                收货地址
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                联系电话
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                总金额
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                状态
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                创建时间
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.user_id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.address }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                ¥{{ order.total_amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="order.status"
                  @change="updateOrderStatus(order)"
                  class="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="待付款">待付款</option>
                  <option value="已付款">已付款</option>
                  <option value="已发货">已发货</option>
                  <option value="已完成">已完成</option>
                  <option value="已取消">已取消</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="viewOrderDetails(order)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  查看详情
                </button>
                <button @click="editOrder(order)" class="text-green-600 hover:text-green-900">
                  编辑
                </button>
                <button @click="deleteOrder(order)" class="text-red-600 hover:text-red-900">
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 订单详情模态框 -->
      <div
        v-if="selectedOrder"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">订单详情</h3>
          <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">订单信息</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <p><span class="text-gray-600">订单ID:</span> {{ selectedOrder.id }}</p>
                <p><span class="text-gray-600">用户ID:</span> {{ selectedOrder.user_id }}</p>
                <p><span class="text-gray-600">收货地址:</span> {{ selectedOrder.address }}</p>
                <p><span class="text-gray-600">联系电话:</span> {{ selectedOrder.phone }}</p>
                <p>
                  <span class="text-gray-600">总金额:</span>
                  <span class="text-red-600 font-semibold">¥{{ selectedOrder.total_amount }}</span>
                </p>
                <p><span class="text-gray-600">状态:</span> {{ selectedOrder.status }}</p>
                <p>
                  <span class="text-gray-600">创建时间:</span>
                  {{ formatDate(selectedOrder.created_at) }}
                </p>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">商品列表</h4>
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      商品名称
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      数量
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      单价
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制尺寸
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制颜色
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制祝福语
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      ¥<input
                        v-model.number="item.price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        class="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-red-600 font-semibold"
                        @change="updateTotalAmount()"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_size || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_color || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_greeting || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <button
              @click="selectedOrder = null"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="showEditForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">编辑订单</h3>
          <form @submit.prevent="saveOrder" class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-900 mb-3">订单信息</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <p><span class="text-gray-600">订单ID:</span> {{ selectedOrder.id }}</p>
                <p><span class="text-gray-600">用户ID:</span> {{ selectedOrder.user_id }}</p>
                <div class="col-span-2">
                  <label class="block text-gray-600 mb-1">收货地址:</label>
                  <input
                    v-model="selectedOrder.address"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="col-span-2">
                  <label class="block text-gray-600 mb-1">联系电话:</label>
                  <input
                    v-model="selectedOrder.phone"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p>
                  <span class="text-gray-600">总金额:</span>
                  <span class="text-red-600 font-semibold">¥{{ selectedOrder.total_amount }}</span>
                </p>
                <div>
                  <label class="block text-gray-600 mb-1">状态:</label>
                  <select
                    v-model="selectedOrder.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="待付款">待付款</option>
                    <option value="已付款">已付款</option>
                    <option value="已发货">已发货</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                  </select>
                </div>
                <p>
                  <span class="text-gray-600">创建时间:</span>
                  {{ formatDate(selectedOrder.created_at) }}
                </p>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-3">商品列表</h4>
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      商品名称
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      数量
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      单价
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制尺寸
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制颜色
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      定制祝福语
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in selectedOrder.items" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @change="updateTotalAmount()"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      ¥<input
                        v-model.number="item.price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        class="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-red-600 font-semibold"
                        @change="updateTotalAmount()"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_size || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_color || '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.custom_greeting || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="showEditForm = false"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([]) // 使用空数组，数据将从API获取
const selectedOrder = ref(null)
const showEditForm = ref(false) // 添加这个变量定义

const API_BASE_URL = 'http://localhost:3001'

// 获取订单列表
const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`)
    if (!response.ok) {
      throw new Error('获取订单列表失败')
    }
    const result = await response.json()
    orders.value = result.data.orders
  } catch (error) {
    console.error('获取订单列表失败:', error)
    alert('获取订单列表失败：' + error.message)
  }
}

// 更新订单状态
const updateOrderStatus = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: order.status }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '更新订单状态失败')
    }
    const result = await response.json()
    alert('订单状态更新成功')
  } catch (error) {
    console.error('更新订单状态失败:', error)
    alert('更新订单状态失败：' + error.message)
    // 恢复原始状态
    const originalOrder = orders.value.find((o) => o.id === order.id)
    if (originalOrder) {
      order.status = originalOrder.status
    }
  }
}

// 查看订单详情
const viewOrderDetails = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '获取订单详情失败')
    }
    const orderDetails = await response.json()
    selectedOrder.value = orderDetails.data // 使用data字段
    // 移除这里的showEditForm.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    alert('获取订单详情失败：' + error.message)
  }
}

const editOrder = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '获取订单详情失败')
    }
    const orderDetails = await response.json()
    selectedOrder.value = orderDetails.data // 修改这里，使用data字段
    showEditForm.value = true
  } catch (error) {
    console.error('获取订单详情失败:', error)
    alert('获取订单详情失败：' + error.message)
  }
}

const deleteOrder = async (order) => {
  if (confirm('确定要删除该订单吗？')) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '删除订单失败')
      }
      alert('订单删除成功')
      fetchOrders() // 重新获取订单列表
    } catch (error) {
      console.error('删除订单失败:', error)
    }
  }
}
// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

// 更新订单总金额
const updateTotalAmount = () => {
  if (selectedOrder.value && selectedOrder.value.items) {
    let total = 0
    selectedOrder.value.items.forEach((item) => {
      total += item.price * item.quantity
    })
    selectedOrder.value.total_amount = total.toFixed(2)
  }
}

const saveOrder = async () => {
  try {
    // 更新总金额
    updateTotalAmount()

    const response = await fetch(`${API_BASE_URL}/api/orders/${selectedOrder.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: selectedOrder.value.address,
        phone: selectedOrder.value.phone,
        status: selectedOrder.value.status,
        items: selectedOrder.value.items,
        total_amount: selectedOrder.value.total_amount,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '更新订单失败')
    }
    const result = await response.json()
    alert('订单更新成功')
    showEditForm.value = false
    fetchOrders()
  } catch (error) {
    console.error('更新订单失败:', error)
    alert('更新订单失败：' + error.message)
  }
}
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-management {
  padding: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th,
.order-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

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
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.order-details {
  margin-top: 20px;
}

.order-details h4 {
  margin: 15px 0 10px;
}

.order-items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.order-items-table th,
.order-items-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
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

select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
