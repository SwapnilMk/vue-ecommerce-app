import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'

interface CartItem {
  product: {
    _id: string
    name: string
    price: number
    category: string
    brand: string
    images: string[]
  }
  quantity: number
}

interface Cart {
  _id: string
  user: string
  items: CartItem[]
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const router = useRouter()
  const authStore = useAuthStore()

  const cartItemCount = computed(() => cart.value?.items.length || 0)
  const cartTotal = computed(
    () =>
      cart.value?.items.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0
  )

  async function fetchCart() {
    if (!authStore.isAuthenticated) return
    try {
      const response = await api.get('/cart')
      cart.value = response.data.cart
    } catch (error: any) {
      console.error('Failed to fetch cart:', error.response?.data?.message || error.message)
    }
  }

  async function addToCart(productId: string, quantity: number = 1) {
    if (!authStore.isAuthenticated) {
      router.push('/sign-in')
      return
    }
    try {
      const response = await api.post(`/cart/${productId}`, { quantity })
      cart.value = response.data.cart
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add to cart')
    }
  }

  async function removeFromCart(productId: string) {
    if (!authStore.isAuthenticated) {
      router.push('/sign-in')
      return
    }
    try {
      const response = await api.delete(`/cart/${productId}`)
      cart.value = response.data.cart
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove from cart')
    }
  }

  async function clearCart() {
    cart.value = null
  }

  return { cart, cartItemCount, cartTotal, fetchCart, addToCart, removeFromCart, clearCart }
})
