<template>
  <UContainer class="py-12 max-w-7xl">
    <h2 class="text-2xl font-semibold mb-6">Account Settings</h2>
    <UCard>
      <div class="space-y-6">
        <!-- Dark/Light Mode Switch -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium">Theme</h3>
            <p class="text-gray-600 text-sm">Toggle between dark and light mode</p>
          </div>
          <UColorModeButton />
        </div>
        <!-- Logout Button -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium">Logout</h3>
            <p class="text-gray-600 text-sm">Sign out of your account</p>
          </div>
          <UButton color="red" variant="solid" :loading="loading" @click="logout">Sign Out</UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../store/auth'

  const authStore = useAuthStore()
  const router = useRouter()
  const loading = ref(false)

  async function logout() {
    loading.value = true
    try {
      authStore.signOut()

      router.push('/sign-in')
    } catch (error: any) {
    } finally {
      loading.value = false
    }
  }
</script>
