<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Products</h1>
      <UButton @click="openAddModal">Add Product</UButton>
    </div>

    <UTable :rows="products" :columns="columns">
      <template #actions-data="{ row }">
        <UButton @click="openEditModal(row)" class="mr-2">Edit</UButton>
        <UButton @click="deleteProduct(row._id)" color="red">Delete</UButton>
      </template>
    </UTable>

    <UModal v-model="isModalOpen">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>
        <UForm :state="productForm" @submit="saveProduct">
          <UFormGroup label="Name" name="name" class="mb-4">
            <UInput v-model="productForm.name" />
          </UFormGroup>
          <UFormGroup label="Description" name="description" class="mb-4">
            <UTextarea v-model="productForm.description" />
          </UFormGroup>
          <UFormGroup label="Price" name="price" class="mb-4">
            <UInput v-model.number="productForm.price" type="number" />
          </UFormGroup>
          <UFormGroup label="Category" name="category" class="mb-4">
            <UInput v-model="productForm.category" />
          </UFormGroup>
          <UFormGroup label="Brand" name="brand" class="mb-4">
            <UInput v-model="productForm.brand" />
          </UFormGroup>
          <UFormGroup label="Stock" name="stock" class="mb-4">
            <UInput v-model.number="productForm.stock" type="number" />
          </UFormGroup>
          <UButton type="submit">{{ isEditing ? 'Save' : 'Add' }}</UButton>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const products = ref([])
  const isModalOpen = ref(false)
  const isEditing = ref(false)
  const productForm = ref({
    _id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
  })

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'actions', label: 'Actions' },
  ]

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v1/products')
      products.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    fetchProducts()
  })

  const openAddModal = () => {
    isEditing.value = false
    productForm.value = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      stock: 0,
    }
    isModalOpen.value = true
  }

  const openEditModal = (product) => {
    isEditing.value = true
    productForm.value = { ...product }
    isModalOpen.value = true
  }

  const saveProduct = async () => {
    try {
      const method = isEditing.value ? 'PUT' : 'POST'
      const url = isEditing.value ? `/api/v1/products/${productForm.value._id}` : '/api/v1/products'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm.value),
      })

      if (response.ok) {
        isModalOpen.value = false
        fetchProducts()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error(error)
    }
  }
</script>
