<template>
  <UApp>
    <div class="flex min-h-screen">
      <aside
        :class="[
          'fixed md:static inset-y-0 left-0 z-40 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 transform transition-transform duration-300 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ]"
      >
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800"
        >
          <RouterLink to="/dashboard" class="font-semibold text-lg">Admin Dashboard</RouterLink>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            class="md:hidden"
            @click="sidebarOpen = false"
          />
        </div>

        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{ 'bg-gray-200 dark:bg-gray-800 font-semibold': route.path === item.to }"
            @click="sidebarOpen = false"
          >
            <UIcon :name="item.icon" class="size-5" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex flex-col flex-1 min-h-screen">
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3 sticky top-0 bg-white dark:bg-gray-950 z-30"
        >
          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-menu"
              class="md:hidden"
              @click="sidebarOpen = true"
            />
            <h1 class="text-xl font-semibold">Dashboard</h1>
          </div>

          <div class="flex items-center gap-3">
            <UColorModeButton />
            <UButton color="neutral" variant="ghost" square>
              <UIcon name="i-lucide-bell" class="size-5" />
            </UButton>

            <UDropdownMenu :items="menuItems" @update:model-value="handleSelect">
              <UAvatar :src="userAvatar" size="md" class="cursor-pointer" />
            </UDropdownMenu>
          </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
          <RouterView />
        </main>

        <!-- Footer -->
        <footer
          class="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          © {{ new Date().getFullYear() }} E-commerce Admin Panel
        </footer>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from '../store/auth'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const sidebarOpen = ref(false)
  const user = computed(() => authStore.user)
  const userAvatar = computed(
    () => `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.value?.name || 'user'}`
  )

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: 'i-lucide-home' },
    { label: 'Customers', to: '/dashboard/customers', icon: 'i-lucide-users' },
    { label: 'Orders', to: '/dashboard/orders', icon: 'i-lucide-shopping-bag' },
    { label: 'Settings', to: '/dashboard/settings', icon: 'i-lucide-cog' },
  ]

  const menuItems = [
    [
      {
        label: user.value?.name || 'User',
        sublabel: user.value?.email || '',
        avatar: { src: userAvatar.value },
        disabled: true,
        value: 'user',
      },
    ],
    [
      { label: 'Profile', icon: 'i-lucide-user', value: 'profile' },
      { label: 'Settings', icon: 'i-lucide-cog', value: 'settings' },
    ],
    [{ label: 'Logout', icon: 'i-lucide-log-out', value: 'logout' }],
  ]

  async function handleSelect(value: string) {
    await nextTick()
    switch (value) {
      case 'profile':
        router.push('/profile')
        break
      case 'settings':
        router.push('/dashboard/settings')
        break
      case 'logout':
        authStore.signOut()
        router.push('/sign-in')
        break
    }
  }
</script>

<style scoped>
  @media (min-width: 768px) {
    aside {
      position: relative !important;
      transform: none !important;
    }
  }
</style>
