import { defineStore } from 'pinia'
import type { Product } from '../types/product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Product[],
  }),

  actions: {
    addToCart(product: Product) {
      const exists = this.items.find((item) => item.id === product.id)
      if (!exists) this.items.push(product)
    },

    removeFromCart(productId: number | string) {
      this.items = this.items.filter((item) => item.id !== productId)
    },

    clearCart() {
      this.items = []
    },
  },

  getters: {
    cartItemCount: (state) => state.items.length,
    cartTotal: (state) => state.items.reduce((total, item) => total + (item.price || 0), 0),
  },
})
