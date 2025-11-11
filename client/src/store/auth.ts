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
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function signUp(credentials: SignUpCredentials) {
    const response = await fetch('http://localhost:5000/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Sign-up failed')

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  async function signIn(credentials: SignInCredentials) {
    const response = await fetch('http://localhost:5000/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Sign-in failed')

    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function signOut() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return { token, user, isAuthenticated, signUp, signIn, signOut, getAuthHeader }
})
