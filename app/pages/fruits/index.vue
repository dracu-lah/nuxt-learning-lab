<!--
  /fruits — Protected list page with URL-state filters and a create dialog.

  Pattern this page demonstrates
  ------------------------------
  1. Per-route auth via `definePageMeta({ middleware: ['auth'] })`.
  2. Reactive filter state pushed to the URL with `useRoute()` /
     `useRouter()`. Open `/fruits?q=mango&category=tropical` to see it.
  3. Watcher syncs filters back to the URL using `replace: true` so the
     browser back button isn't flooded with one entry per keystroke.
  4. List is computed from the Pinia store + the filters. No useFetch
     because this is a client-side store, not a server route.
  5. <UModal> hosts the create dialog. The form lives in a reusable
     <FruitForm /> component that is also used by the edit page.
-->
<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-3 flex-wrap">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ $t('fruits.title') }}</h1>
        <p class="text-sm text-(--ui-text-muted)">{{ $t('fruits.subtitle') }}</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">
        {{ $t('fruits.create') }}
      </UButton>
    </div>

    <!-- Filters: search + category dropdown + harvested-on date -->
    <UCard>
      <div class="grid sm:grid-cols-3 gap-3">
        <UInput
          v-model="q"
          :placeholder="$t('fruits.search')"
          icon="i-lucide-search"
        />
        <USelectMenu
          v-model="category"
          :items="categoryFilterItems"
          value-key="value"
          :placeholder="$t('fruits.allCategories')"
        />
        <UInput
          v-model="harvestedFrom"
          type="date"
          :placeholder="$t('fruits.harvested')"
          icon="i-lucide-calendar"
        />
      </div>
      <div v-if="q || category || harvestedFrom" class="pt-3">
        <UButton size="xs" variant="ghost" color="neutral" icon="i-lucide-x" @click="resetFilters">
          {{ $t('fruits.resetFilters') }}
        </UButton>
      </div>
    </UCard>

    <!-- Results -->
    <p class="text-xs text-(--ui-text-muted)">
      {{ filtered.length }} / {{ store.count }} {{ $t('fruits.results') }}
    </p>

    <div v-if="!filtered.length" class="text-center py-16 text-(--ui-text-muted)">
      {{ $t('fruits.empty') }}
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="fruit in filtered"
        :key="fruit.id"
        :ui="{ body: 'p-4' }"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold leading-tight">{{ fruit.name }}</h3>
              <UBadge v-if="fruit.organic" size="xs" color="success" variant="subtle">
                {{ $t('fruits.organic') }}
              </UBadge>
            </div>
            <p class="text-xs text-(--ui-text-muted) capitalize">
              {{ $t(`fruits.cat.${fruit.category}`) }} · {{ fruit.harvestedOn }}
            </p>
          </div>
          <div class="text-right">
            <p class="font-mono">${{ fruit.price.toFixed(2) }}</p>
            <p class="text-xs text-(--ui-text-muted)">×{{ fruit.qty }}</p>
          </div>
        </div>
        <p v-if="fruit.notes" class="text-xs text-(--ui-text-muted) mt-2 line-clamp-2">
          {{ fruit.notes }}
        </p>
        <div class="flex justify-end gap-1 mt-3">
          <UButton
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-pencil"
            :to="localePath(`/fruits/${fruit.id}/edit`)"
          />
          <UButton
            size="xs"
            variant="ghost"
            color="error"
            icon="i-lucide-trash-2"
            @click="confirmDelete(fruit.id)"
          />
        </div>
      </UCard>
    </div>

    <!-- Create dialog -->
    <UModal v-model:open="createOpen" :title="$t('fruits.create')" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <FruitForm
          :submit-label="$t('fruits.create')"
          @submit="onCreate"
          @cancel="createOpen = false"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useFruitsStore } from '~/stores/fruits'
import type { FruitCategory } from '~/stores/fruits'

definePageMeta({ middleware: ['auth'] })

useHead({ title: 'Fruits · Nuxt Learning Lab' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const store = useFruitsStore()

// --- filter state bound to URL search params ---------------------------
const q = ref((route.query.q as string) ?? '')
const category = ref((route.query.category as string) ?? '')
const harvestedFrom = ref((route.query.from as string) ?? '')

watch([q, category, harvestedFrom], () => {
  const query: Record<string, string> = {}
  if (q.value) query.q = q.value
  if (category.value) query.category = category.value
  if (harvestedFrom.value) query.from = harvestedFrom.value
  router.replace({ query })
})

const categoryFilterItems = computed(() => [
  { label: t('fruits.allCategories'), value: '' },
  { label: t('fruits.cat.citrus'),    value: 'citrus' },
  { label: t('fruits.cat.berry'),     value: 'berry' },
  { label: t('fruits.cat.tropical'),  value: 'tropical' },
  { label: t('fruits.cat.stone'),     value: 'stone' },
  { label: t('fruits.cat.melon'),     value: 'melon' }
])

// --- derived list -------------------------------------------------------
const filtered = computed(() => {
  const needle = q.value.trim().toLowerCase()
  return store.items.filter((f) => {
    if (needle && !f.name.toLowerCase().includes(needle)) return false
    if (category.value && f.category !== category.value) return false
    if (harvestedFrom.value && f.harvestedOn < harvestedFrom.value) return false
    return true
  })
})

function resetFilters() {
  q.value = ''
  category.value = ''
  harvestedFrom.value = ''
}

// --- create dialog ------------------------------------------------------
const createOpen = ref(false)
function openCreate() { createOpen.value = true }

function onCreate(value: Parameters<typeof store.create>[0]) {
  store.create(value)
  createOpen.value = false
  toast.add({ title: t('fruits.created'), color: 'success' })
}

// --- delete -------------------------------------------------------------
function confirmDelete(id: string) {
  if (!window.confirm(t('fruits.confirmDelete'))) return
  store.remove(id)
  toast.add({ title: t('fruits.deleted'), color: 'success' })
}

// silence unused-import warning when category type is referenced in
// generated TS output
type _CategoryUsage = FruitCategory
</script>
