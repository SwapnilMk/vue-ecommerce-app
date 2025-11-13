<template>
  <UContainer class="py-12 max-w-7xl">
    <h2 class="text-2xl font-semibold mb-6">Profile</h2>
    <UCard>
      <p class="text-gray-600">Welcome, {{ authStore.user?.name }}</p>
      <p>Email: {{ authStore.user?.email }}</p>
      <p>Phone: {{ authStore.user?.phone }}</p>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
  import { useAuthStore } from '../store/auth'
  const authStore = useAuthStore()
</script>
