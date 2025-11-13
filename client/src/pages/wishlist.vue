<template>
  <UContainer class="py-10">
    <h2 class="text-2xl font-semibold mb-6">Your Wishlist</h2>
    <div
      v-if="wishlistItems.length > 0"
      class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <UCard
        v-for="item in wishlistItems"
        :key="item._id"
        class="hover:shadow-lg transition cursor-pointer"
      >
        <template #header>
          <img
            :src="item.images || 'https://via.placeholder.com/300'"
            :alt="item.name"
            class="w-full h-48 object-cover rounded-md"
          />
        </template>
        <div class="space-y-2">
          <h3 class="text-lg font-medium">{{ item.name }}</h3>
          <p class="text-gray-500 text-sm line-clamp-2">{{ item.description }}</p>
          <p class="text-lg font-semibold text-primary">₹{{ item.price }}</p>
          <div class="flex gap-2">
            <UButton
              size="sm"
              color="primary"
              icon="i-heroicons-shopping-cart"
              :disabled="item.stock <= 0"
              @click="addToCart(item._id)"
            >
              Add to Cart
            </UButton>
            <UButton
              size="sm"
              color="red"
              icon="i-heroicons-heart-solid"
              @click="removeFromWishlist(item._id)"
            >
              Remove
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else class="text-center text-gray-500 py-20">
      <UIcon name="i-heroicons-heart" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <p>Your wishlist is empty</p>
      <UButton to="/" color="primary" class="mt-4">Continue Shopping</UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useWishlistStore } from '../store/wishlist'
  import { useCartStore } from '../store/cart'

  const wishlistStore = useWishlistStore()
  const cartStore = useCartStore()

  const wishlistItems = computed(() => wishlistStore.wishlist)

  async function addToCart(productId: string) {
    try {
      await cartStore.addToCart(productId)
      alert('Added to cart!')
    } catch (error: any) {
      alert(error.message)
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      await wishlistStore.removeFromWishlist(productId)
    } catch (error: any) {
      alert(error.message)
    }
  }

  onMounted(() => {
    wishlistStore.fetchWishlist()
  })
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
