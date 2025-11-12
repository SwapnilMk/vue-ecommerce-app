<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Orders</h1>
    </div>

    <UTable :rows="orders" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const orders = ref([])

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'user.name', label: 'Customer' },
    { key: 'totalAmount', label: 'Total' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'orderStatus', label: 'Order Status' },
    { key: 'actions', label: 'Actions' },
  ]

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/v1/orders')
      orders.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    fetchOrders()
  })
</script>
