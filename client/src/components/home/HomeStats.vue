<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import api from '../../api'
  import type { Stat } from '../../types'

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const stats = ref<Stat[]>([
    { title: 'Users', icon: 'i-lucide-users', value: 0 },
    { title: 'Orders', icon: 'i-lucide-shopping-cart', value: 0 },
    { title: 'Revenue', icon: 'i-lucide-circle-dollar-sign', value: formatCurrency(0) },
    { title: 'Products', icon: 'i-lucide-package', value: 0 },
  ])

  async function fetchStats() {
    try {
      const response = await api.get('/dashboard/stats')
      const { totalUsers, totalOrders, totalRevenue, totalProducts } = response.data
      stats.value = [
        { title: 'Users', icon: 'i-lucide-users', value: totalUsers },
        { title: 'Orders', icon: 'i-lucide-shopping-cart', value: totalOrders },
        {
          title: 'Revenue',
          icon: 'i-lucide-circle-dollar-sign',
          value: formatCurrency(totalRevenue),
        },
        { title: 'Products', icon: 'i-lucide-package', value: totalProducts },
      ]
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  onMounted(() => {
    fetchStats()
  })
</script>

<template>
  <UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      :to="
        {
          Users: '/dashboard/customers',
          Orders: '/dashboard/orders',
          Revenue: '/dashboard/orders',
          Products: '/dashboard/products',
        }[stat.title]
      "
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <span class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
