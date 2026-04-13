<!--
  Bar chart for the dashboard. Uses `vue-chartjs` (the canonical chart.js
  binding for Vue) and the registered Chart.js controllers/elements.

  Important: the `.client.vue` suffix tells Nuxt to render this component
  ONLY in the browser. Chart.js touches `window` and a `<canvas>`, so SSR
  would crash without this hint. (It's the Nuxt analog of Next.js's
  `'use client'` directive.)
-->
<template>
  <Bar :data="data" :options="options" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  values: number[]
  label: string
}>()

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.values,
      backgroundColor: 'oklch(0.637 0.237 25.331 / 0.7)',
      borderColor:     'oklch(0.577 0.245 27.325)',
      borderWidth: 1
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true }
  }
}
</script>
