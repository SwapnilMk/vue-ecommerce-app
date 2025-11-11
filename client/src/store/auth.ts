import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'USER' | 'ADMIN'
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

interface SignUpCredentials {
  name: string
  email: string
  phone: string
  password: string
}

interface SignInCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // signup
  async function signUp(credentials: SignUpCredentials) {
    const response = await fetch('/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data.errors ? data.errors[0].message : data.message || 'Sign-up failed'
      throw new Error(message)
    }

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  // signin
  async function signIn(credentials: SignInCredentials) {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data.errors ? data.errors[0].message : data.message || 'Sign-in failed'
      throw new Error(message)
    }

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  // sign out
  function signOut() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  }
})
