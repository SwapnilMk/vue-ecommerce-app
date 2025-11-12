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

        <div v-if="isAuthenticated">
          <UDropdownMenu :items="items">
            <UAvatar :src="userAvatar" size="md" class="cursor-pointer" />
          </UDropdownMenu>
        </div>

        <div v-else>
          <UButton to="/sign-in" color="primary" variant="soft">Sign In</UButton>
        </div>
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
  import { computed } from 'vue'
  import { useAuthStore } from '../store/auth'
  import type { DropdownMenuItem } from '@nuxt/ui'
  import { useCartStore } from '../store/cart'

  import { User, ShoppingBag, Settings } from 'lucide-vue-next'

  const authStore = useAuthStore()
  const cartStore = useCartStore()

  const cartItemCount = computed(() => cartStore.cartItemCount)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userAvatar = computed(
    () => `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.value?.name || 'user'}`
  )

  const items = computed<DropdownMenuItem[][]>(() => [
    [
      {
        label: user.value?.name || 'User',
        sublabel: user.value?.email || '',
        avatar: { src: userAvatar.value },
        disabled: true,
      },
    ],
    [
      { label: 'Profile', icon: User, to: '/profile' },
      { label: 'Orders', icon: ShoppingBag, to: '/orders' },
      { label: 'Settings', icon: Settings, to: '/settings' },
    ],
  ])
</script>
