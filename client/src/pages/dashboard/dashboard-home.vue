<script setup lang="ts">
  import { ref, shallowRef } from 'vue'
  import { sub } from 'date-fns'
  import type { Period, Range } from '../../types'

  const range = shallowRef<Range>({
    start: sub(new Date(), { days: 14 }),
    end: new Date(),
  })
  const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
