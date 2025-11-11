<template>
  <UContainer class="py-10 space-y-12">
    <!-- Hero srction -->
    <section class="text-center space-y-4">
      <h1 class="text-4xl font-bold">Welcome to Ecommerce App 🛍️</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Explore our top-selling products and get the best deals in town.
      </p>
    </section>

    <USeparator />

    <!-- Products card listingf -->
    <section>
      <h2 class="text-2xl font-semibold mb-6">Featured Products</h2>

      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <UCard
          v-for="product in products"
          :key="product.id"
          class="hover:shadow-lg transition cursor-pointer"
          @click="goToProduct(product.id)"
        >
          <template #header>
            <img
              :src="product.images[0]"
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
    </section>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const products = ref([
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Crystal clear sound with deep bass and noise cancellation.',
      price: 2499,
      category: 'Electronics',
      brand: 'Boat',
      stock: 10,
      images: ['https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800'],
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Track your steps, heart rate and sleep with precision.',
      price: 3999,
      category: 'Wearables',
      brand: 'Noise',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
    },
    {
      id: 3,
      name: 'Running Shoes',
      description: 'Lightweight and durable shoes perfect for everyday runs.',
      price: 2999,
      category: 'Fashion',
      brand: 'Nike',
      stock: 20,
      images: ['https://images.unsplash.com/photo-1606813902734-8977f84c7a58?w=800'],
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      description: 'Portable speaker with crisp highs and deep bass.',
      price: 1499,
      category: 'Audio',
      brand: 'JBL',
      stock: 25,
      images: ['https://images.unsplash.com/photo-1602526219045-68bb0a6f7b1c?w=800'],
    },
  ])

  function goToProduct(id: number) {
    router.push(`/product/${id}`)
  }
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
