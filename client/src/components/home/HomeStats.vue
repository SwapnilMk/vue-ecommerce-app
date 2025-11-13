<script setup lang="ts">
  import { useDashboardData } from '../../composables/useDashboardData'
  import { computed } from 'vue'

  const { dashboardData, loading, error } = useDashboardData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const stats = computed(() => [
    {
      title: 'Customers',
      icon: 'i-lucide-users',
      value: dashboardData.value?.totalUsers || 0,
      variation: 0,
    },
    {
      title: 'Products',
      icon: 'i-lucide-box',
      value: dashboardData.value?.totalProducts || 0,
      variation: 0,
    },
    {
      title: 'Orders',
      icon: 'i-lucide-shopping-cart',
      value: dashboardData.value?.totalOrders || 0,
      variation: 0,
    },
    {
      title: 'Revenue',
      icon: 'i-lucide-circle-dollar-sign',
      value: formatCurrency(dashboardData.value?.totalRevenue || 0),
      variation: 0,
    },
  ])
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <UPageGrid v-else class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      to="/customers"
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

        <UBadge :color="stat.variation > 0 ? 'success' : 'error'" variant="subtle" class="text-xs">
          {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
