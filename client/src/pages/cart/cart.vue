<template>
  <UContainer class="py-10">
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1">
        <h2 class="text-2xl font-semibold mb-6">Shopping Cart</h2>
        <div v-if="cartItems.length > 0" class="space-y-4">
          <UCard
            v-for="item in cartItems"
            :key="item.product._id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-4">
              <img
                :src="item.product.images"
                :alt="item.product.name"
                class="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h3 class="font-medium text-lg">{{ item.product.name }}</h3>
                <p class="text-sm text-gray-500">
                  {{ item.product.category }} • {{ item.product.brand }}
                </p>
                <p class="font-semibold text-primary mt-1">
                  ₹{{ item.product.price }} x {{ item.quantity }}
                </p>
              </div>
            </div>
            <UButton
              color="warning"
              variant="soft"
              icon="i-heroicons-trash"
              @click="removeItem(item.product._id)"
            >
              Remove
            </UButton>
          </UCard>
        </div>
        <div v-else class="text-center text-gray-500 py-20">
          <UIcon name="i-heroicons-shopping-cart" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Your cart is empty</p>
          <UButton to="/" color="primary" class="mt-4">Continue Shopping</UButton>
        </div>
      </div>
      <div class="w-full lg:w-80">
        <UCard class="p-4 sticky top-24">
          <h3 class="text-xl font-semibold mb-4">Order Summary</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>Items ({{ cartItemCount }})</span>
              <span>₹{{ cartTotal.toLocaleString('en-IN') }}</span>
            </div>
            <UDivider />
            <div class="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{{ cartTotal.toLocaleString('en-IN') }}</span>
            </div>
          </div>
          <UButton
            color="primary"
            size="lg"
            block
            class="mt-6"
            :disabled="cartItems.length === 0"
            @click="buyNow"
          >
            Buy Now
          </UButton>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '../../store/cart'
  import { useAuthStore } from '../../store/auth'
  import api from '../../api'

  const router = useRouter()
  const cartStore = useCartStore()
  const authStore = useAuthStore()

  const cartItems = computed(() => cartStore.cart?.items || [])
  const cartItemCount = computed(() => cartStore.cartItemCount)
  const cartTotal = computed(() => cartStore.cartTotal)

  async function removeItem(productId: string) {
    try {
      await cartStore.removeFromCart(productId)
    } catch (error: any) {
      alert(error.message)
    }
  }

  async function buyNow() {
    if (!authStore.isAuthenticated) {
      router.push('/sign-in')
      return
    }
    if (cartItems.value.length === 0) return
    try {
      // Create order
      const orderItems = cartItems.value.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        quantity: item.quantity,
        price: item.product.price,
      }))
      const response = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          fullName: authStore.user?.name || '',
          phone: authStore.user?.phone || '',
          addressLine1: authStore.user?.addressLine1 || '',
          addressLine2: authStore.user?.addressLine2 || '',
          city: authStore.user?.city || '',
          state: authStore.user?.state || '',
          postalCode: authStore.user?.postalCode || '',
          country: authStore.user?.country || '',
        },
        paymentMethod: 'COD',
        totalAmount: cartTotal.value,
      })
      alert('Order placed successfully!')
      await cartStore.clearCart()
      router.push('/orders')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to place order')
    }
  }

  onMounted(() => {
    if (authStore.isAuthenticated) {
      cartStore.fetchCart()
    }
  })
</script>
