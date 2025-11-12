import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createSharedComposable } from '@vueuse/core'
import { defineShortcuts } from '@nuxt/ui/runtime/composables/defineShortcuts.js'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-i': () => router.push('/inbox'),
    'g-c': () => router.push('/customers'),
    n: () => (isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value),
  })

  watch(
    () => route.fullPath,
    () => {
      isNotificationsSlideoverOpen.value = false
    }
  )

  return {
    isNotificationsSlideoverOpen,
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
