<script setup lang="ts">
  import { h, resolveComponent, ref, watch, onMounted, reactive, computed } from 'vue'
  import type { TableColumn } from '@nuxt/ui'
  import { getPaginationRowModel } from '@tanstack/table-core'
  import api from '../../api'
  import type { Order } from '../../types'
  import * as z from 'zod'
  import type { FormSubmitEvent } from '@nuxt/ui'

  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')
  const UInput = resolveComponent('UInput')
  const USelect = resolveComponent('USelect')
  const UModal = resolveComponent('UModal')
  const UForm = resolveComponent('UForm')
  const UFormField = resolveComponent('UFormField')

  const columnFilters = ref([{ id: 'customer', value: '' }])
  const data = ref<Order[]>([])
  const allOrdersState = ref<Order[]>([])
  const isFetching = ref(false)
  const showEditModal = ref(false)
  const selectedOrder = ref<Order | null>(null)
  const totalOrders = ref(0)

  const schema = z.object({
    orderStatus: z.string().min(1, 'Status is required'),
  })
  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    orderStatus: '',
  })

  const statuses = ref(['PROCESSING', 'SHIPPED', 'DELIVERED'])

  async function fetchOrders() {
    isFetching.value = true

    try {
      const response = await api.get('/orders')

      const orders = response.data.orders.map((order: any) => ({
        id: order._id,
        user: {
          id: order.user?._id,
          name: order.user?.name,
          email: order.user?.email,
        },
        orderItems: order.orderItems.map((item: any) => ({
          product: {
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
          },
          quantity: item.quantity,
          price: item.price,
          id: item._id,
        })),
        totalAmount: order.totalAmount,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      }))

      allOrdersState.value = orders
      totalOrders.value = orders.length

      const start = pagination.value.pageIndex * pagination.value.pageSize
      data.value = filteredData.value.slice(start, start + pagination.value.pageSize)
    } catch (error) {}

    isFetching.value = false
  }

  const filteredData = computed(() => {
    let orders = [...allOrdersState.value]
    const name = columnFilters.value[0]?.value?.toLowerCase()
    const status = statusFilter.value !== 'all' ? statusFilter.value : null

    if (name) orders = orders.filter((o) => o.user?.name?.toLowerCase().includes(name))
    if (status) orders = orders.filter((o) => o.orderStatus === status)

    return orders
  })

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (!selectedOrder.value) return

    try {
      const response = await api.put(`/orders/${selectedOrder.value.id}`, {
        orderStatus: event.data.orderStatus,
      })

      allOrdersState.value = allOrdersState.value.map((order) =>
        order.id === selectedOrder.value?.id
          ? { ...order, orderStatus: response.data.order.orderStatus }
          : order
      )

      fetchOrders()
      showEditModal.value = false
      state.orderStatus = ''
      selectedOrder.value = null
    } catch (error) {}
  }

  function openEditModal(order: Order) {
    selectedOrder.value = order
    state.orderStatus = order.orderStatus
    showEditModal.value = true
  }

  const columns: TableColumn<Order>[] = [
    {
      id: 'serial',
      header: 'Sr',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        return h('div', row.index + 1 + pageIndex * pageSize)
      },
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => h('div', row.original.id.slice(0, 8) + '...'),
    },
    {
      id: 'customer',
      header: 'Customer',
      cell: ({ row }) =>
        h('div', [
          h('p', { class: 'font-medium text-highlighted' }, row.original.user?.name),
          h('p', { class: 'text-gray-500 text-sm' }, row.original.user?.email),
        ]),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total',
      cell: ({ row }) => {
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(row.original.totalAmount)
        return h('div', formatted)
      },
    },
    {
      accessorKey: 'orderStatus',
      header: 'Status',
      cell: ({ row }) => {
        const color =
          row.original.orderStatus === 'DELIVERED'
            ? 'green'
            : row.original.orderStatus === 'SHIPPED'
              ? 'blue'
              : 'yellow'

        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.original.orderStatus.toLowerCase()
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: [
              { type: 'label', label: 'Actions' },
              {
                label: 'Copy Order ID',
                icon: 'i-lucide-copy',
                onSelect: () => navigator.clipboard.writeText(row.original.id),
              },
              { type: 'separator' },
              {
                label: 'Edit Status',
                icon: 'i-lucide-edit',
                onSelect: () => openEditModal(row.original),
              },
            ],
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              variant: 'ghost',
            })
        ),
    },
  ]

  const statusFilter = ref('all')

  watch(statusFilter, fetchOrders)
  watch(columnFilters, fetchOrders, { deep: true })

  const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
  })
  watch(pagination, fetchOrders, { deep: true })

  onMounted(fetchOrders)
</script>

<template>
  <UContainer class="w-full max-w-full">
    <h2 class="text-2xl font-semibold">Orders</h2>

    <UDashboardPanel id="orders">
      <template #body>
        <div class="flex justify-between max-w-full">
          <UInput
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter by customer name..."
            :model-value="columnFilters[0].value"
            @update:model-value="columnFilters[0].value = $event"
          />

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'All', value: 'all' },
              ...statuses.map((s) => ({ label: s, value: s })),
            ]"
            class="min-w-28"
          />
        </div>

        <div class="w-full overflow-x-auto">
          <UTable
            ref="table"
            :data="data"
            :columns="columns"
            :loading="isFetching"
            v-model:pagination="pagination"
            :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
            class="w-full"
          />
        </div>

        <div class="mt-4 text-sm">Showing {{ data.length }} of {{ totalOrders }} orders</div>
      </template>
    </UDashboardPanel>

    <UModal title="Edit Order Status" v-model="showEditModal">
      <template #body>
        <UForm :schema="schema" :state="state" @submit="onSubmit">
          <UFormField label="Order Status" name="orderStatus">
            <USelect v-model="state.orderStatus" :items="statuses" />
          </UFormField>

          <div class="flex justify-end gap-2 mt-4">
            <UButton color="gray" @click="showEditModal = false">Cancel</UButton>
            <UButton type="submit" color="primary">Update</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </UContainer>
</template>

<style scoped>
  img {
    max-width: 100%;
  }
</style>
