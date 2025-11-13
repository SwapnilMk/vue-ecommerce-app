<script setup lang="ts">
  import { h, resolveComponent, ref, watch, useTemplateRef, onMounted, reactive } from 'vue'
  import { upperFirst } from 'scule'
  import type { TableColumn } from '@nuxt/ui'
  import { getPaginationRowModel } from '@tanstack/table-core'
  import api from '../../api'
  import type { Product } from '../../types'
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

  const table = useTemplateRef('table')

  const schema = z.object({
    name: z.string().min(1, 'Product name is required').trim(),
    price: z.number().min(0, 'Price cannot be negative'),
    stock: z.number().min(0, 'Stock cannot be negative'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().optional(),
    description: z.string().optional(),
  })

  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    description: '',
  })

  const imageFiles = ref<File[]>([])
  const categories = ref(['Electronics', 'Clothing', 'Books']) 
  const columnFilters = ref([{ id: 'name', value: '' }])
  const columnVisibility = ref({})
  const rowSelection = ref({})
  const data = ref<Product[]>([])
  const isFetching = ref(false)
  const showAddModal = ref(false)
  const showEditModal = ref(false)
  const totalProducts = ref(0)
  const selectedProduct = ref<Product | null>(null)

  const editState = reactive<Partial<Schema>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    description: '',
  })

  async function fetchProducts() {
    isFetching.value = true
    try {
      const response = await api.get('/products')
      const allProducts = response.data.products.map((product: any) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand || '',
        images: product.images || [],
        description: product.description || '',
      }))
      totalProducts.value = allProducts.length
      const start = pagination.value.pageIndex * pagination.value.pageSize
      data.value = allProducts.slice(start, start + pagination.value.pageSize)
    } catch (error: any) {
    } finally {
      isFetching.value = false
    }
  }

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (imageFiles.value.length === 0) {
      return
    }
    if (imageFiles.value.some((file) => file.size > 5 * 1024 * 1024)) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', event.data.name)
      formData.append('price', event.data.price.toString())
      formData.append('stock', event.data.stock.toString())
      formData.append('category', event.data.category)
      if (event.data.brand) formData.append('brand', event.data.brand)
      if (event.data.description) formData.append('description', event.data.description)
      imageFiles.value.forEach((file) => formData.append('images', file))

      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      data.value.unshift({
        id: response.data.product._id,
        name: response.data.product.name,
        price: response.data.product.price,
        stock: response.data.product.stock,
        category: response.data.product.category,
        brand: response.data.product.brand || '',
        images: response.data.product.images || [],
        description: response.data.product.description || '',
      })
      totalProducts.value += 1

      showAddModal.value = false
      state.name = ''
      state.price = 0
      state.stock = 0
      state.category = ''
      state.brand = ''
      state.description = ''
      imageFiles.value = []
    } catch (error: any) {}
  }

  async function deleteProduct(id: string) {
    try {
      await api.delete(`/products/${id}`)
      data.value = data.value.filter((product) => product.id !== id)
      totalProducts.value -= 1
    } catch (error: any) {}
  }

  function openEditModal(product: Product) {
    selectedProduct.value = product
    editState.name = product.name
    editState.price = product.price
    editState.stock = product.stock
    editState.category = product.category
    editState.brand = product.brand
    editState.description = product.description
    showEditModal.value = true
  }

  async function onUpdate(event: FormSubmitEvent<Schema>) {
    if (!selectedProduct.value) return

    try {
      const formData = new FormData()
      formData.append('name', event.data.name)
      formData.append('price', event.data.price.toString())
      formData.append('stock', event.data.stock.toString())
      formData.append('category', event.data.category)
      if (event.data.brand) formData.append('brand', event.data.brand)
      if (event.data.description) formData.append('description', event.data.description)
      if (imageFiles.value.length > 0) {
        imageFiles.value.forEach((file) => formData.append('images', file))
      }

      const response = await api.put(`/products/${selectedProduct.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const index = data.value.findIndex((p) => p.id === selectedProduct.value?.id)
      if (index !== -1) {
        data.value[index] = {
          id: response.data.product._id,
          name: response.data.product.name,
          price: response.data.product.price,
          stock: response.data.product.stock,
          category: response.data.product.category,
          brand: response.data.product.brand || '',
          images: response.data.product.images || [],
          description: response.data.product.description || '',
        }
      }

      showEditModal.value = false
      selectedProduct.value = null
      imageFiles.value = []
    } catch (error: any) {}
  }

  onMounted(() => {
    fetchProducts()
  })

  function getRowItems(row: any) {
    return [
      { type: 'label', label: 'Actions' },
      {
        label: 'Copy product ID',
        icon: 'i-lucide-copy',
        onSelect() {
          navigator.clipboard.writeText(row.original.id)
        },
      },
      { type: 'separator' },
      {
        label: 'Edit product',
        icon: 'i-lucide-edit',
        onSelect() {
          openEditModal(row.original)
        },
      },
      { type: 'separator' },
      {
        label: 'Delete product',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect() {
          if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(row.original.id)
          }
        },
      },
    ]
  }

  const columns: TableColumn<Product>[] = [
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
        const image = row.original.images[0] || 'https://via.placeholder.com/40'
        return h('div', { class: 'flex items-center gap-3' }, [
          h('img', { src: image, class: 'w-10 h-10 rounded object-cover', alt: row.original.name }),
          h('div', [
            h('p', { class: 'font-medium text-highlighted' }, row.original.name),
            h(
              'p',
              { class: 'text-gray-500 text-sm' },
              row.original.description?.slice(0, 30) +
              (row.original.description ? row.original.description.slice(0, 30) : '') +
              (row.original.description && row.original.description.length > 30 ? '...' : '')
            ),
          ]),
        ])
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(row.original.price)
        return h('div', formatted)
      },
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => h('div', row.original.stock),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        return h(
          UBadge,
          { class: 'capitalize', variant: 'subtle', color: 'blue' },
          () => row.original.category
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

  const categoryFilter = ref('all')

  watch(
    () => categoryFilter.value,
    (newVal) => {
      if (!table?.value?.tableApi) return
      const categoryColumn = table.value.tableApi.getColumn('category')
      if (!categoryColumn) return
      categoryColumn.setFilterValue(newVal === 'all' ? undefined : newVal)
    }
  )

  const pagination = ref({
    pageIndex: 0,
    pageSize: 10,
  })

  watch(
    pagination,
    () => {
      fetchProducts()
    },
    { deep: true }
  )

  function handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      imageFiles.value = Array.from(input.files)
    } else {
      imageFiles.value = []
    }
  }
</script>

<template>
  <UContainer class="max-w-full py-6">
    <h2 class="text-2xl font-semibold mb-6">Products</h2>
    <UDashboardPanel id="products">
      <template #body>
        <div class="flex flex-wrap items-center justify-between gap-1.5 mb-4 max-w-full">
          <UInput
            :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
            class="max-w-sm"
            icon="i-lucide-search"
            placeholder="Filter products..."
            @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
          />
          <div class="flex flex-wrap items-center gap-1.5">
            <USelect
              v-model="categoryFilter"
              :items="[
                { label: 'All', value: 'all' },
                ...categories.map((cat) => ({ label: cat, value: cat })),
              ]"
              placeholder="Filter category"
              class="min-w-28"
            />
            <UButton
              label="Add Product"
              color="primary"
              icon="i-lucide-plus"
              @click="showAddModal = true"
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
            {{ totalProducts }} row(s) selected.
          </div>
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="totalProducts"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </template>
    </UDashboardPanel>

    <UModal title="Add New Product" v-model="showAddModal">
      <template #body>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormField label="Name" name="name" required>
            <UInput v-model="state.name" placeholder="Product name" />
          </UFormField>
          <UFormField label="Price" name="price" required>
            <UInput v-model.number="state.price" type="number" min="0" placeholder="Price" />
          </UFormField>
          <UFormField label="Stock" name="stock" required>
            <UInput v-model.number="state.stock" type="number" min="0" placeholder="Stock" />
          </UFormField>
          <UFormField label="Category" name="category" required>
            <USelect v-model="state.category" :items="categories" placeholder="Select category" />
          </UFormField>
          <UFormField label="Brand" name="brand">
            <UInput v-model="state.brand" placeholder="Brand name" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UInput v-model="state.description" placeholder="Description" />
          </UFormField>
          <UFormField label="Product Images" name="images" required>
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleImageChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="mt-1 text-sm text-gray-500">Select one or more images (max 5MB each)</p>
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton type="button" color="gray" @click="showAddModal = false">Cancel</UButton>
            <UButton type="submit" color="primary">Add Product</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal title="Edit Product" v-model="showEditModal">
      <template #body>
        <UForm :schema="schema" :state="editState" class="space-y-4" @submit="onUpdate">
          <UFormField label="Name" name="name" required>
            <UInput v-model="editState.name" placeholder="Product name" />
          </UFormField>
          <UFormField label="Price" name="price" required>
            <UInput v-model.number="editState.price" type="number" min="0" placeholder="Price" />
          </UFormField>
          <UFormField label="Stock" name="stock" required>
            <UInput v-model.number="editState.stock" type="number" min="0" placeholder="Stock" />
          </UFormField>
          <UFormField label="Category" name="category" required>
            <USelect
              v-model="editState.category"
              :items="categories"
              placeholder="Select category"
            />
          </UFormField>
          <UFormField label="Brand" name="brand">
            <UInput v-model="editState.brand" placeholder="Brand name" />
          </UFormField>
          <UFormField label="Description" name="description">
            <UInput v-model="editState.description" placeholder="Description" />
          </UFormField>
          <UFormField label="Product Images" name="images">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleImageChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="mt-1 text-sm text-gray-500">Select one or more images (max 5MB each)</p>
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton type="button" color="gray" @click="showEditModal = false">Cancel</UButton>
            <UButton type="submit" color="primary">Update Product</UButton>
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
