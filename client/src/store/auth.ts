import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

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
    try {
      const response = await api.post('/users', credentials)
      const { token: newToken, user: newUser } = response.data
      token.value = newToken
      user.value = newUser
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign-up failed')
    }
  }

  async function signIn(credentials: SignInCredentials) {
    try {
      const response = await api.post('/users/login', credentials)
      const { token: newToken, user: newUser } = response.data
      token.value = newToken
      user.value = newUser
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Sign-in failed')
    }
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
