<template>
  <UContainer class="py-10">
    <UCard v-if="product" class="max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
          <img
            :src="selectedImage || product.images[0]"
            class="w-full h-80 object-cover rounded-lg border"
            alt="Product image"
          />
          <div class="flex gap-2 mt-3">
            <img
              v-for="img in product.images"
              :key="img"
              :src="img"
              @click="selectedImage = img"
              class="w-16 h-16 object-cover cursor-pointer rounded border hover:border-primary"
            />
          </div>
        </div>

        <div class="md:w-1/2 flex flex-col justify-between">
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold">{{ product.name }}</h1>
            <p class="text-gray-500">{{ product.category }} • {{ product.brand }}</p>
            <p class="text-2xl font-bold text-primary">
              ₹{{ product.price.toLocaleString('en-IN') }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ product.description }}
            </p>
            <p :class="['font-medium', product.stock > 0 ? 'text-green-600' : 'text-red-500']">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </p>
          </div>

          <!-- add to cart button -->
          <UButton
            size="lg"
            color="primary"
            icon="i-heroicons-shopping-cart"
            class="mt-6"
            :disabled="product.stock <= 0"
            @click="addToCart(product)"
          >
            Add to Cart
          </UButton>
        </div>
      </div>
    </UCard>

    <div v-else class="text-center py-10 text-gray-500">Loading product details...</div>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useCartStore } from '../../store/cart'

  const route = useRoute()
  const cartStore = useCartStore()

  const selectedImage = ref<string | null>(null)
  const product = ref<any>(null)

  // Dummy data
  const dummyProducts = [
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
  ]

  onMounted(() => {
    const id = Number(route.params.id)
    product.value = dummyProducts.find((p) => p.id === id) || null
  })

  function addToCart(product: any) {
    cartStore.addToCart(product)
  }
</script>
