<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Your Orders</h1>
    </div>
    <UTable
      v-if="orders.length"
      :data="orders"
      :columns="columns"
      :loading="loading"
      class="flex-1"
    />
    <div v-else-if="!loading && !orders.length" class="text-center text-gray-500 py-10">
      <p>No orders found</p>
      <UButton to="/" color="primary" class="mt-4">Continue Shopping</UButton>
    </div>
    <div v-else class="text-center text-gray-500 py-10">
      <p>Loading orders...</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { h, onMounted, ref, resolveComponent } from 'vue'
  import type { TableColumn } from '@nuxt/ui'
  import type { Row } from '@tanstack/vue-table'
  import api from '../api'
  import { useClipboard } from '@vueuse/core'

  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const { copy } = useClipboard()

  interface Order {
    _id: string
    totalAmount: number
    paymentStatus: string
    orderStatus: string
    createdAt: string
    user?: { name: string; email: string }
    orderItems?: Array<{
      product: { _id: string; name: string; price: number; images: string[] }
      name: string
      image: string
      quantity: number
      price: number
    }>
    shippingAddress?: {
      fullName: string
      phone: string
      addressLine1: string
      addressLine2: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }

  const orders = ref<Order[]>([])
  const loading = ref(false)

  const columns: TableColumn<Order>[] = [
    {
      id: '_id',
      accessorKey: '_id',
      header: 'Order ID',
      cell: ({ row }) => `#${row.getValue('_id')}`,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => {
        return new Date(row.getValue('createdAt')).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      },
    },
    {
      id: 'totalAmount',
      accessorKey: 'totalAmount',
      header: () => h('div', { class: 'text-right' }, 'Total'),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue('totalAmount'))
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(amount)
        return h('div', { class: 'text-right font-medium' }, formatted)
      },
    },
    {
      id: 'paymentStatus',
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string
        const color =
          {
            PAID: 'green',
            PENDING: 'yellow',
            FAILED: 'red',
          }[status] || 'gray'
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status)
      },
    },
    {
      id: 'orderStatus',
      accessorKey: 'orderStatus',
      header: 'Order Status',
      cell: ({ row }) => {
        const status = row.getValue('orderStatus') as string
        const color =
          {
            DELIVERED: 'green',
            PROCESSING: 'yellow',
            CANCELLED: 'red',
          }[status] || 'gray'
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => status)
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return h(
          'div',
          { class: 'text-right' },
          h(
            UDropdownMenu,
            {
              content: {
                align: 'end',
              },
              items: getRowItems(row),
              'aria-label': 'Actions dropdown',
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
                'aria-label': 'Actions dropdown',
              })
          )
        )
      },
    },
  ]

  function getRowItems(row: Row<Order>) {
    return [
      {
        type: 'label',
        label: 'Actions',
      },
      {
        label: 'Copy Order ID',
        onSelect() {
          copy(row.original._id)
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'View Order',
        to: `/order/${row.original._id}`,
      },
    ]
  }

  async function fetchOrders() {
    loading.value = true
    try {
      const response = await api.get('/orders')
      orders.value = response.data.orders
      console.log('Fetched orders:', orders.value)
    } catch (error: any) {
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchOrders()
  })
</script>
