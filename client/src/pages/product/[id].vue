<template>
  <UContainer class="py-10">
    <UCard v-if="product" class="max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/2">
          <img
            :src="selectedImage || product.images[0] || 'https://via.placeholder.com/300'"
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
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.description }}</p>
            <p :class="['font-medium', product.stock > 0 ? 'text-green-600' : 'text-red-500']">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </p>
          </div>
          <div class="flex gap-4 mt-6">
            <UButton
              size="lg"
              color="primary"
              icon="i-heroicons-shopping-cart"
              :disabled="product.stock <= 0"
              @click="addToCart(product)"
            >
              Add to Cart
            </UButton>
            <UButton
              size="lg"
              :color="isInWishlist ? 'red' : 'gray'"
              :icon="isInWishlist ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              @click="toggleWishlist(product._id)"
            >
              {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
    <div v-else class="text-center py-10 text-gray-500">Loading product details...</div>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '../../api'
  import { useCartStore } from '../../store/cart'
  import { useWishlistStore } from '../../store/wishlist'

  const route = useRoute()
  const cartStore = useCartStore()
  const wishlistStore = useWishlistStore()

  const selectedImage = ref<string | null>(null)
  const product = ref<any>(null)

  const isInWishlist = computed(() =>
    wishlistStore.wishlist.some((item) => item._id === product.value?._id)
  )

  async function fetchProduct() {
    try {
      const response = await api.get(`/products/${route.params.id}`)
      product.value = response.data.product
    } catch (error: any) {
      console.error('Failed to fetch product:', error.response?.data?.message || error.message)
    }
  }

  async function addToCart(product: any) {
    try {
      await cartStore.addToCart(product._id)
      alert('Added to cart!')
    } catch (error: any) {
      alert(error.message)
    }
  }

  async function toggleWishlist(productId: string) {
    try {
      if (isInWishlist.value) {
        await wishlistStore.removeFromWishlist(productId)
      } else {
        await wishlistStore.addToWishlist(productId)
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  onMounted(() => {
    fetchProduct()
    if (wishlistStore.wishlist.length === 0) {
      wishlistStore.fetchWishlist()
    }
  })
</script>
