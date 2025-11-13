<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Order Details</h1>
      <UButton to="/orders" color="primary" variant="link" icon="i-heroicons-arrow-left">
        Back to Orders
      </UButton>
    </div>
    <UCard v-if="order" class="max-w-7xl mx-auto">
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold">Order ID: {{ order._id }}</h2>
          <p class="text-gray-500">
            Placed on {{ new Date(order.createdAt).toLocaleDateString() }}
          </p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Items</h3>
          <UCard
            v-for="item in order.orderItems"
            :key="item.product._id"
            class="flex items-center gap-4"
          >
            <img
              :src="item.image || 'https://via.placeholder.com/80'"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded-md"
            />
            <div class="flex-1">
              <h4 class="font-medium">{{ item.name }}</h4>
              <p class="text-sm text-gray-500">
                ₹{{ item.price.toLocaleString('en-IN') }} x {{ item.quantity }}
              </p>
            </div>
            <p class="font-semibold">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</p>
          </UCard>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Shipping Address</h3>
          <p>{{ order.shippingAddress.fullName }}</p>
          <p>{{ order.shippingAddress.addressLine1 }}</p>
          <p v-if="order.shippingAddress.addressLine2">
            {{ order.shippingAddress.addressLine2 }}
          </p>
          <p>
            {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}
            {{ order.shippingAddress.postalCode }}
          </p>
          <p>{{ order.shippingAddress.country }}</p>
          <p>Phone: {{ order.shippingAddress.phone }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold">Order Summary</h3>
          <div class="flex justify-between">
            <span>Payment Status</span>
            <span :class="[order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600']">
              {{ order.paymentStatus }}
            </span>
          </div>
          <div class="flex justify-between">
            <span>Order Status</span>
            <span
              :class="[order.orderStatus === 'DELIVERED' ? 'text-green-600' : 'text-yellow-600']"
            >
              {{ order.orderStatus }}
            </span>
          </div>
          <div class="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{{ order.totalAmount.toLocaleString('en-IN') }}</span>
          </div>
        </div>
        <div v-if="order.paymentStatus !== 'PAID'">
          <UButton color="primary" size="lg" @click="markAsPaid" :disabled="loading">
            Make a Payment
          </UButton>
        </div>
      </div>
    </UCard>
    <div v-else class="text-center py-10 text-gray-500">
      <p>Loading order details...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '../../api'

  const route = useRoute()
  const order = ref<any>(null)
  const loading = ref(false)

  async function fetchOrder() {
    try {
      const response = await api.get(`/orders/${route.params.id}`)
      order.value = response.data.order
    } catch (error: any) {
      console.error('Failed to fetch order:', error.response?.data?.message || error.message)
    }
  }

  async function markAsPaid() {
    loading.value = true
    try {
      const response = await api.put(`/orders/${route.params.id}/pay`)
      order.value = response.data.order
      alert('Payment Successfull')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update order')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchOrder()
  })
</script>
