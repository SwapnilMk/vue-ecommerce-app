<template>
  <UContainer class="py-10 space-y-12">
    <section class="text-center space-y-4">
      <h1 class="text-4xl font-bold">Welcome to Ecommerce App 🛍️</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Explore our top-selling products and get the best deals in town.
      </p>
    </section>

    <USeparator />

    <section>
      <h2 class="text-2xl font-semibold mb-6">Featured Products</h2>
      <div v-if="products.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <UCard
          v-for="product in products"
          :key="product._id"
          class="hover:shadow-lg transition cursor-pointer"
          @click="goToProduct(product._id)"
        >
          <template #header>
            <img
              :src="product.images[0] || 'https://via.placeholder.com/300'"
              :alt="product.name"
              class="w-full h-48 object-cover rounded-md"
            />
          </template>
          <div class="space-y-2">
            <h3 class="text-lg font-medium">{{ product.name }}</h3>
            <p class="text-gray-500 text-sm line-clamp-2">{{ product.description }}</p>
            <p class="text-lg font-semibold text-primary">
              ₹{{ product.price.toLocaleString('en-IN') }}
            </p>
          </div>
        </UCard>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        <p>Loading products...</p>
      </div>
    </section>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../api'

  const router = useRouter()
  const products = ref<any[]>([])

  async function fetchProducts() {
    try {
      const response = await api.get('/products')
      products.value = response.data.products
    } catch (error: any) {
      console.error('Failed to fetch products:', error.response?.data?.message || error.message)
    }
  }

  function goToProduct(id: string) {
    router.push(`/product/${id}`)
  }

  onMounted(() => {
    fetchProducts()
  })
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
