<template>
  <div class="border rounded-lg p-4 shadow-md">
    <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover mb-4" />
    <h3 class="text-lg font-semibold">
      {{ product.name }}
    </h3>
    <p class="text-gray-600">
      {{ product.price }}
    </p>
    <button
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="addToCart"
    >
      Add to Cart
    </button>
  </div>
</template>

<script setup>
  import { useCartStore } from '../store/cart'

  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  })

  const cartStore = useCartStore()

  const addToCart = () => {
    cartStore.addToCart(props.product)
  }
</script>
