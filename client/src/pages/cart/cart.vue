<template>
  <UContainer class="py-10">
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1">
        <h2 class="text-2xl font-semibold mb-6">Shopping Cart</h2>

        <div v-if="cartItems.length > 0" class="space-y-4">
          <UCard v-for="item in cartItems" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                :src="item.images[0]"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h3 class="font-medium text-lg">{{ item.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.category }} • {{ item.brand }}</p>
                <p class="font-semibold text-primary mt-1">
                  ₹{{ item.price.toLocaleString('en-IN') }}
                </p>
              </div>
            </div>

            <UButton
              color="warning"
              variant="soft"
              icon="i-heroicons-trash"
              @click="removeItem(item.id)"
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
  import { computed } from 'vue'
  import { useCartStore } from '../../store/cart'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cartStore = useCartStore()

  const cartItems = computed(() => cartStore.items)
  const cartItemCount = computed(() => cartStore.cartItemCount)
  const cartTotal = computed(() => cartStore.cartTotal)

  function removeItem(id: number | string) {
    cartStore.removeFromCart(id)
  }

  function buyNow() {
    if (cartItems.value.length === 0) return
    alert('Order placed successfully!')
    cartStore.clearCart()
    router.push('/')
  }
</script>
