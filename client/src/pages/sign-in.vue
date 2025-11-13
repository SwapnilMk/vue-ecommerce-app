<template>
  <UContainer class="py-12">
    <UCard class="max-w-md mx-auto">
      <!-- Header -->
      <template #header>
        <h2 class="text-2xl font-semibold text-center">Sign In</h2>
      </template>

      <!-- Sign In Form -->
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <!-- Email -->
        <UFormField label="Email" name="email" required>
          <UInput v-model="state.email" type="email" placeholder="you@example.com" icon="i-heroicons-envelope"
            class="w-full" />
        </UFormField>

        <!-- Password -->
        <UFormField label="Password" name="password" required>
          <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
            icon="i-heroicons-lock-closed" class="w-full">
            <template #trailing>
              <UButton variant="ghost" color="neutral" size="xs" @click="showPassword = !showPassword">
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
              </UButton>
            </template>
          </UInput>
        </UFormField>

        <!-- Submit Button -->
        <UButton type="submit" block size="lg" color="primary" :loading="loading" class="mt-4">
          Sign In
        </UButton>
      </UForm>

      <!-- Footer -->
      <template #footer>
        <div class="text-center mt-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">Don’t have an account?</span>
          <UButton to="/sign-up" variant="link" color="primary" class="p-0 ml-1">
            Create one
          </UButton>
        </div>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '../store/auth'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
})

const loading = ref(false)
const showPassword = ref(false)

const router = useRouter()
const authStore = useAuthStore()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await authStore.signIn(event.data)
    if (authStore.user?.role === 'ADMIN') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    console.error(error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.u-form-field label {
  font-weight: 500;
  color: var(--text-muted);
}
</style>
