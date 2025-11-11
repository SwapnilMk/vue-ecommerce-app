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
          <UDropdownMenu :items="menuItems" @select="handleSelect">
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
  import { ref, computed, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../store/auth'
  import { useCartStore } from '../store/cart'

  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  const cartItemCount = computed(() => cartStore.cartItemCount)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userAvatar = computed(
    () => `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.value?.name || 'user'}`
  )

  // Define dropdown items with keys (no inline click handlers)
  const menuItems = ref<any[]>([])

  watch(
    isAuthenticated,
    (loggedIn) => {
      if (loggedIn) {
        menuItems.value = [
          [
            {
              label: user.value?.name || 'User',
              sublabel: user.value?.email || '',
              avatar: { src: userAvatar.value },
              type: 'label',
              key: 'user',
            },
          ],
          [
            { label: 'Profile', icon: 'i-lucide-user', key: 'profile' },
            { label: 'Orders', icon: 'i-lucide-shopping-bag', key: 'orders' },
            { label: 'Settings', icon: 'i-lucide-cog', key: 'settings' },
          ],
          [{ label: 'Logout', icon: 'i-lucide-log-out', key: 'logout' }],
        ]
      } else {
        menuItems.value = []
      }
    },
    { immediate: true }
  )

  // handle navigation centrally
  async function handleSelect(item: any) {
    await nextTick() // ensure dropdown closes first
    switch (item.key) {
      case 'profile':
        router.push('/profile')
        break
      case 'orders':
        router.push('/orders')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        authStore.signOut()
        router.push('/sign-in')
        break
    }
  }
</script>
