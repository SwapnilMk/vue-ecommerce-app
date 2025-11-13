<script setup lang="ts">
  import { h, resolveComponent, ref, watch } from 'vue'
  import type { TableColumn } from '@nuxt/ui'
  import { useDashboardData } from '../../composables/useDashboardData'
  import type { Sale } from '../../types'

  const { dashboardData, loading, error } = useDashboardData()

  const UBadge = resolveComponent('UBadge')

  const data = ref<Sale[]>([])

  watch(
    [() => dashboardData.value],
    () => {
      if (!dashboardData.value) return

      data.value = dashboardData.value.recentOrders.map((order) => ({
        id: order._id,
        date: order.createdAt,
        status: order.orderStatus.toLowerCase(),
        email: order.user.name,
        amount: order.totalAmount,
      }))
    },
    { immediate: true }
  )

  const columns: TableColumn<Sale>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => `#${row.getValue('id')}`,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return new Date(row.getValue('date')).toLocaleString('en-US', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const color = {
          processing: 'primary' as const,
          delivered: 'success' as const,
          cancelled: 'error' as const,
        }[row.getValue('status') as string]

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.getValue('status')
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Customer',
    },
    {
      accessorKey: 'amount',
      header: () => h('div', { class: 'text-right' }, 'Amount'),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('amount'))

        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)

        return h('div', { class: 'text-right font-medium' }, formatted)
      },
    },
  ]
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="overflow-x-auto">
    <UTable
      :data="data"
      :columns="columns"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
      }"
    />
  </div>
</template>
