<template>
  <UContainer class="py-12">
    <UCard class="max-w-3xl mx-auto">
      <!-- Header -->
      <template #header>
        <h2 class="text-2xl font-semibold text-center">Create your account</h2>
      </template>

      <!-- Signup Form -->
      <UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
        <!-- Full Name -->
        <UFormField label="Full Name" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="John Doe"
            icon="i-heroicons-user"
            class="w-full"
          />
        </UFormField>

        <!-- Email + Phone -->
        <div class="flex flex-col sm:flex-row gap-0 sm:gap-2">
          <UFormField label="Email" name="email" class="flex-1" required>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Phone" name="phone" class="flex-1" required>
            <UInput
              v-model="state.phone"
              type="tel"
              placeholder="9876543210"
              icon="i-heroicons-phone"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Address Line 1 -->
        <UFormField label="Address Line 1" name="addressLine1">
          <UInput
            v-model="state.addressLine1"
            placeholder="123 Main Street"
            icon="i-heroicons-home"
            class="w-full"
          />
        </UFormField>

        <!-- Address Line 2 + City -->
        <div class="flex flex-col sm:flex-row gap-0 sm:gap-2">
          <UFormField label="Address Line 2" name="addressLine2" class="flex-1">
            <UInput
              v-model="state.addressLine2"
              placeholder="Apt #4B"
              icon="i-heroicons-home-modern"
              class="w-full"
            />
          </UFormField>
          <UFormField label="City" name="city" class="flex-1">
            <UInput v-model="state.city" placeholder="New York" class="w-full" />
          </UFormField>
        </div>

        <!-- State + Postal Code + Country -->
        <div class="flex flex-col sm:flex-row gap-0 sm:gap-2">
          <UFormField label="State" name="state" class="flex-1">
            <UInput v-model="state.state" placeholder="NY" class="w-full" />
          </UFormField>
          <UFormField label="Postal Code" name="postalCode" class="flex-1">
            <UInput v-model="state.postalCode" placeholder="10001" class="w-full" />
          </UFormField>
          <UFormField label="Country" name="country" class="flex-1">
            <UInput v-model="state.country" placeholder="USA" class="w-full" />
          </UFormField>
        </div>

        <!-- Password + Confirm Password -->
        <div class="flex flex-col sm:flex-row gap-0 sm:gap-2">
          <UFormField label="Password" name="password" class="flex-1" required>
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  @click="showPassword = !showPassword"
                >
                  <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" />
                </UButton>
              </template>
            </UInput>
          </UFormField>

          <UFormField label="Confirm Password" name="passwordConfirm" class="flex-1" required>
            <UInput
              v-model="state.passwordConfirm"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              icon="i-heroicons-check-circle"
              class="w-full"
            >
              <template #trailing>
                <UButton
                  variant="ghost"
                  color="neutral"
                  size="xs"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <UIcon
                    :name="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  />
                </UButton>
              </template>
            </UInput>
          </UFormField>
        </div>

        <!-- Submit Button -->
        <UButton type="submit" block size="lg" color="primary" :loading="loading" class="mt-4">
          Create Account
        </UButton>
      </UForm>

      <!-- Footer -->
      <template #footer>
        <div class="text-center mt-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">Already have an account?</span>
          <UButton to="/sign-in" variant="link" color="primary" class="p-0 ml-1">Sign In</UButton>
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

  // ✅ Validation Schema
  const schema = z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      passwordConfirm: z.string(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ['passwordConfirm'],
    })

  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })

  const loading = ref(false)
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)

  const router = useRouter()
  const authStore = useAuthStore()

  // ✅ Handle form submission
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
      await authStore.signUp(event.data)
      router.push('/')
    } catch (error) {
      console.error(error)
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

  /* Make all form fields flush and consistent */
  .UInput,
  .u-input,
  input,
  textarea,
  select {
    width: 100%;
  }

  .flex-row > * {
    margin: 0;
    padding: 0;
  }
</style>
