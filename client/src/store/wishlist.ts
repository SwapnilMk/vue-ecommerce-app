import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'

interface Product {
  _id: string
  name: string
  price: number
  category: string
  brand: string
  images: string[]
}

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlist = ref<Product[]>([])
  const router = useRouter()
  const authStore = useAuthStore()

  const wishlistItemCount = computed(() => wishlist.value.length)

  async function fetchWishlist() {
    if (!authStore.isAuthenticated) return
    try {
      const response = await api.get('/wishlist')
      wishlist.value = response.data.wishlist
    } catch (error: any) {
      console.error('Failed to fetch wishlist:', error.response?.data?.message || error.message)
    }
  }

  async function addToWishlist(productId: string) {
    if (!authStore.isAuthenticated) {
      router.push('/sign-in')
      return
    }
    try {
      const response = await api.post(`/wishlist/${productId}`)
      wishlist.value = response.data.wishlist
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  async function removeFromWishlist(productId: string) {
    if (!authStore.isAuthenticated) {
      router.push('/sign-in')
      return
    }
    try {
      const response = await api.delete(`/wishlist/${productId}`)
      wishlist.value = response.data.wishlist
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist')
    }
  }

  return { wishlist, wishlistItemCount, fetchWishlist, addToWishlist, removeFromWishlist }
})
