<template>
  <UApp>
    <UHeader>
      <template #left>
        <RouterLink to="/" class="font-semibold text-lg">Ecommerce App</RouterLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton :to="'/cart'" color="neutral" variant="ghost" class="relative">
          <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
          <UBadge
            v-if="cartItemCount > 0"
            color="primary"
            class="absolute -top-1.5 -right-1.5 text-[10px] px-1 py-0.5 rounded-full"
          >
            {{ cartItemCount }}
          </UBadge>
        </UButton>

        <UButton :to="'/user'" color="neutral" variant="ghost" icon="i-heroicons-user" />
      </template>
    </UHeader>

    <UMain>
      <RouterView />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">© {{ new Date().getFullYear() }} Ecommerce App</p>
      </template>
    </UFooter>
  </UApp>
</template>

<script setup lang="ts">
  import { RouterView, RouterLink } from 'vue-router'
  import { computed } from 'vue'
  import { useCartStore } from '../store/cart'

  const cartStore = useCartStore()
  const cartItemCount = computed(() => cartStore.cartItemCount)
</script>
