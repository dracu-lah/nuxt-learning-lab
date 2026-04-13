<!--
  /dashboard — Protected page with KPI cards + a chart.

  KEY BIT: `definePageMeta({ middleware: ['auth'] })` is what makes this
  page protected. The `auth` middleware file under /middleware runs before
  the page renders and bounces you to /auth/login if there's no session.

  Inside the component we use `useApi()` — our fetch wrapper that attaches
  the Bearer token — to hit a protected endpoint and render the response.
-->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ $t('dashboard.title') }}</h1>
      <p class="text-sm text-(--ui-text-muted)">{{ $t('dashboard.subtitle') }}</p>
    </div>

    <!-- KPI row -->
    <div class="grid sm:grid-cols-3 gap-4">
      <UCard v-for="kpi in kpis" :key="kpi.label">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-(--ui-text-muted)">{{ kpi.label }}</p>
            <p class="text-2xl font-bold font-mono pt-1">{{ kpi.value }}</p>
          </div>
          <UIcon :name="kpi.icon" class="text-2xl text-(--ui-primary)" />
        </div>
      </UCard>
    </div>

    <!-- Chart -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">{{ $t('dashboard.chartTitle') }}</h2>
      </template>
      <div class="h-72">
        <ChartsSalesChart
          :labels="chartLabels"
          :values="chartValues"
          :label="$t('dashboard.chartLabel')"
        />
      </div>
    </UCard>

    <!-- Account info -->
    <UCard>
      <div class="space-y-2">
        <p class="text-sm text-(--ui-text-muted)">
          {{ $t('auth.signedInAs', { email: auth.user?.email }) }}
        </p>
        <pre class="text-xs bg-(--ui-bg-elevated) p-3 overflow-auto">{{ me }}</pre>
      </div>
    </UCard>

    <UButton color="neutral" variant="soft" icon="i-lucide-log-out" @click="handleLogout">
      {{ $t('nav.logout') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useFruitsStore } from '~/stores/fruits'
import { useCartStore } from '~/stores/cart'

// This is the line that makes the page protected.
definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
useHead({ title: 'Dashboard · Nuxt Learning Lab' })

const auth = useAuthStore()
const cart = useCartStore()
const fruits = useFruitsStore()
const router = useRouter()
const localePath = useLocalePath()
const api = useApi()

// Fetch /api/me with the token attached. We do this even though `auth.user`
// is already populated, just to demonstrate the authed-fetch pattern.
const me = ref<unknown>(null)
onMounted(async () => {
  try {
    me.value = await api<unknown>('/api/me')
  } catch {
    me.value = { error: 'failed to load' }
  }
})

const kpis = computed(() => [
  { label: t('dashboard.kpiFruits'), value: fruits.count,             icon: 'i-lucide-apple' },
  { label: t('dashboard.kpiCart'),   value: cart.count,               icon: 'i-lucide-shopping-cart' },
  { label: t('dashboard.kpiValue'),  value: '$' + cart.subtotal.toFixed(2), icon: 'i-lucide-dollar-sign' }
])

// Aggregate fruits by category for the chart.
const byCategory = computed(() => {
  const acc: Record<string, number> = {}
  for (const f of fruits.items) {
    acc[f.category] = (acc[f.category] || 0) + f.qty
  }
  return acc
})
const chartLabels = computed(() => Object.keys(byCategory.value).map(c => t(`fruits.cat.${c}`)))
const chartValues = computed(() => Object.values(byCategory.value))

async function handleLogout() {
  auth.logout()
  await router.push(localePath('/'))
}
</script>
