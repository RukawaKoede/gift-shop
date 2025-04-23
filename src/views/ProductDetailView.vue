<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI, cartAPI } from '../mock/api'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const quantity = ref(1)
const loading = ref(false)
const error = ref('')
const addingToCart = ref(false)

const loadProduct = async () => {
  try {
    loading.value = true
    error.value = ''
    const res = await productAPI.getProductById(route.params.id)
    product.value = res.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  try {
    addingToCart.value = true
    error.value = ''
    await cartAPI.addToCart({
      productId: product.value.id,
      quantity: quantity.value,
    })
    router.push('/cart')
  } catch (err) {
    error.value = err.message
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="product" class="product-detail">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="product-info">
        <h2>{{ product.name }}</h2>
        <p class="description">{{ product.description }}</p>
        <p class="price">¥{{ product.price }}</p>
        <p class="stock">库存: {{ product.stock }}件</p>

        <div class="details">
          <h3>商品详情</h3>
          <p>{{ product.details }}</p>
        </div>

        <div class="purchase-section">
          <div class="quantity-selector">
            <button @click="quantity > 1 && quantity--" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button
              @click="quantity < product.stock && quantity++"
              :disabled="quantity >= product.stock"
            >
              +
            </button>
          </div>

          <button
            class="add-to-cart-btn"
            @click="addToCart"
            :disabled="addingToCart || product.stock === 0"
          >
            {{ addingToCart ? '添加中...' : '加入购物车' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-info h2 {
  margin: 0;
  font-size: 2em;
}

.description {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

.price {
  color: #e53935;
  font-size: 1.8em;
  font-weight: bold;
  margin: 0;
}

.stock {
  color: #666;
  font-size: 1em;
  margin: 0;
}

.details {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.details h3 {
  margin: 0 0 10px 0;
}

.purchase-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-top: 20px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-to-cart-btn {
  flex: 1;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

.error-message {
  color: #ff4444;
  text-align: center;
  padding: 40px;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>
