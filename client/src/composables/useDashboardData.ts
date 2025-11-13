import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'

export const useDashboardData = () => {
  const dashboardData = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const authStore = useAuthStore()

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/dashboard', {
        headers: {
          ...authStore.getAuthHeader(),
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }
      dashboardData.value = data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  return {
    dashboardData,
    loading,
    error,
  }
}
