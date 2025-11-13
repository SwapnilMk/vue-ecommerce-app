<script setup lang="ts">
  import { h, resolveComponent, ref, onMounted } from 'vue'
  import type { TableColumn } from '@nuxt/ui'
  import api from '../../api'
  import type { Sale } from '../../types'

  const UBadge = resolveComponent('UBadge')

  const data = ref<Sale[]>([])

  async function fetchRecentOrders() {
    try {
      const response = await api.get('/orders/all', { params: { limit: 5 } })
      data.value = response.data.orders.map((order:any) => ({
        name: order.user.name,
        date: order.createdAt,
        status: order.paymentStatus.toLowerCase(),
        email: order.user.email,
        amount: order.totalAmount,
      }))
    } catch (error) {
      console.error('Failed to fetch recent orders:', error)
    }
  }

  onMounted(() => {
    fetchRecentOrders()
  })

  const columns: TableColumn<Sale>[] = [
    {
      accessorKey: 'name',
      header: 'Customer Name',
      cell: ({ row }) => row.getValue('name'),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return new Date(row.getValue('date')).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      },
    },
    {
      accessorKey: 'status',
      header: 'Payment Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        const color =
          {
            paid: 'green',
            pending: 'yellow',
            failed: 'red',
          }[status] || 'gray'
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status)
      },
    },
    {
      accessorKey: 'email',
      header: 'Customer Email',
    },
    {
      accessorKey: 'amount',
      header: () => h('div', { class: 'text-right' }, 'Amount'),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('amount'))
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(amount)
        return h('div', { class: 'text-right font-medium' }, formatted)
      },
    },
  ]
</script>

<template>
  <div class="overflow-x-auto">
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
