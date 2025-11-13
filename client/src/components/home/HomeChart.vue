<script setup lang="ts">
  import { computed, useTemplateRef, ref, watch } from 'vue'
  import { format, startOfDay, endOfDay } from 'date-fns'
  import { VisXYContainer, VisLine, VisAxis, VisArea, VisCrosshair, VisTooltip } from '@unovis/vue'
  import { useElementSize } from '@vueuse/core'
  import api from '../../api'
  import type { Period, Range, ChartData } from '../../types'

  const cardRef = useTemplateRef<HTMLElement | null>('cardRef')
  const props = defineProps<{
    period: Period
    range: Range
  }>()

  const { width } = useElementSize(cardRef)
  const data = ref<ChartData[]>([])

  watch(
    [() => props.period, () => props.range],
    async () => {
      try {
        const response = await api.get('/dashboard/chart', {
          params: {
            period: props.period,
            start: props.range.start.toISOString(),
            end: props.range.end.toISOString(),
          },
        })
        data.value = response.data.data
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      }
    },
    { immediate: true }
  )

  const x = (_: ChartData, i: number) => i
  const y = (d: ChartData) => d.amount

  const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))

  const formatNumber = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format

  const formatDate = (date: string): string => {
    return {
      daily: format(new Date(date), 'd MMM'),
      weekly: format(new Date(date), 'd MMM'),
      monthly: format(new Date(date), 'MMM yyyy'),
    }[props.period]
  }

  const xTicks = (i: number) => {
    if (i < 0 || i >= data.value.length || !data.value[i]) {
      return ''
    }
    return formatDate(data.value[i].date)
  }

  const template = (d: ChartData) => `${formatDate(d.date)}: ${formatNumber(d.amount)}`
</script>

<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">Order Revenue</p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <VisXYContainer :data="data" :padding="{ top: 40 }" class="h-64 sm:h-96" :width="width">
      <VisLine :x="x" :y="y" color="var(--ui-primary)" />
      <VisArea :x="x" :y="y" color="var(--ui-primary)" :opacity="0.1" />
      <VisAxis type="x" :x="x" :tick-format="xTicks" />
      <VisCrosshair color="var(--ui-primary)" :template="template" />
      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<style scoped>
  .unovis-xy-container {
    --vis-crosshair-line-stroke-color: var(--ui-primary);
    --vis-crosshair-circle-stroke-color: var(--ui-bg);
    --vis-axis-grid-color: var(--ui-border);
    --vis-axis-tick-color: var(--ui-border);
    --vis-axis-tick-label-color: var(--ui-text-dimmed);
    --vis-tooltip-background-color: var(--ui-bg);
    --vis-tooltip-border-color: var(--ui-border);
    --vis-tooltip-text-color: var(--ui-text-highlighted);
  }
</style>
