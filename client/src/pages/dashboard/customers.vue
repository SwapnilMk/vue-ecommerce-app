<script setup lang="ts">
  import { h, resolveComponent, ref, watch, useTemplateRef, onMounted } from 'vue'
  import { upperFirst } from 'scule'
  import type { TableColumn } from '@nuxt/ui'
  import { getPaginationRowModel } from '@tanstack/table-core'
  import api from '../../api'
  import type { User } from '../../types'

  const UAvatar = resolveComponent('UAvatar')
  const UButton = resolveComponent('UButton')
  const UBadge = resolveComponent('UBadge')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const table = useTemplateRef('table')

  const columnFilters = ref([{ id: 'email', value: '' }])
  const columnVisibility = ref({})
  const rowSelection = ref({})

  const data = ref<User[]>([])
  const isFetching = ref(false)

  async function fetchUsers() {
    isFetching.value = true
    try {
      const response = await api.get('/users')
      data.value = response.data.users.map((user: any) => ({
        id: user._id, 
        name: user.name,
        email: user.email,
        role: user.role,
      }))
    } catch (error: any) {
    } finally {
      isFetching.value = false
    }
  }

  onMounted(() => {
    fetchUsers()
  })

  function getRowItems(row: any) {
    return [
      { type: 'label', label: 'Actions' },
      {
        label: 'Copy customer ID',
        icon: 'i-lucide-copy',
        onSelect() {
          navigator.clipboard.writeText(row.original.id)
        },
      },
      { type: 'separator' },
      {
        label: 'View customer orders',
        icon: 'i-lucide-shopping-bag',
        onSelect() {},
      },
      { type: 'separator' },
      {
        label: 'Delete customer',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect() {},
      },
    ]
  }

  const columns: TableColumn<User>[] = [
    {
      id: 'serial',
      header: 'Sr',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        const serialNumber = row.index + 1 + pageIndex * pageSize
        return h('div', serialNumber)
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const avatarSrc = `https://api.dicebear.com/9.x/avataaars/svg?seed=${row.original.name}`
        return h('div', { class: 'flex items-center gap-3' }, [
          h(UAvatar, { src: avatarSrc, size: 'lg' }),
          h('div', [
            h('p', { class: 'font-medium text-highlighted' }, row.original.name),
            h(
              'p',
              { class: 'text-gray-500' },
              `@${row.original.name.toLowerCase().replace(/\s+/g, '')}`
            ),
          ]),
        ])
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        const isSorted = column.getIsSorted()
        return h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          label: 'Email',
          icon: isSorted
            ? isSorted === 'asc'
              ? 'i-lucide-arrow-up-narrow-wide'
              : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
          class: '-mx-2.5',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        })
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const color = row.original.role === 'ADMIN' ? 'blue' : 'green'
        return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
          row.original.role.toLowerCase()
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return h('div', { class: 'text-right' }, [
          h(
            UDropdownMenu,
            {
              content: { align: 'end' },
              items: getRowItems(row),
            },
            () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
                class: 'ml-auto',
              })
          ),
        ])
      },
    },
  ]

  const roleFilter = ref('all')

  watch(
    () => roleFilter.value,
    (newVal) => {
      if (!table?.value?.tableApi) return
      const roleColumn = table.value.tableApi.getColumn('role')
      if (!roleColumn) return
      roleColumn.setFilterValue(newVal === 'all' ? undefined : newVal)
    }
  )

  const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
  })
</script>

<template>
  <UContainer class="max-w-full">
    <h2 class="text-2xl font-semibold mb-6">Customers</h2>
    <UDashboardPanel id="customers">
      <template #body>
        <div class="flex flex-wrap items-center justify-between gap-1.5 mb-4">
          <UInput
            :model-value="table?.tableApi?.getColumn('email')?.getFilterValue() as string"
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter emails..."
            @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
          />
          <div class="flex flex-wrap items-center gap-1.5">
            <USelect
              v-model="roleFilter"
              :items="[
                { label: 'All', value: 'all' },
                { label: 'User', value: 'USER' },
                { label: 'Admin', value: 'ADMIN' },
              ]"
              placeholder="Filter role"
              class="min-w-28"
            />
            <UDropdownMenu
              :items="
                table?.tableApi
                  ?.getAllColumns()
                  .filter((column: any) => column.getCanHide())
                  .map((column: any) => ({
                    label: upperFirst(column.id),
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onUpdateChecked(checked: boolean) {
                      table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                    },
                    onSelect(e?: Event) {
                      e?.preventDefault()
                    },
                  }))
              "
              :content="{ align: 'end' }"
            >
              <UButton label="Display" color="neutral" trailing-icon="i-lucide-settings-2" />
            </UDropdownMenu>
          </div>
        </div>

        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          v-model:column-visibility="columnVisibility"
          v-model:row-selection="rowSelection"
          v-model:pagination="pagination"
          :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
          class="shrink-0"
          :data="data"
          :columns="columns"
          :loading="isFetching"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0',
          }"
        />

        <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
          <div class="text-sm text-muted">
            {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
          </div>
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </template>
    </UDashboardPanel>
  </UContainer>
</template>
