<!--
  /products — Search params demo.

  What this page teaches:
    1. Reading and writing URL search params with `useRoute` / `useRouter`.
    2. Declarative data fetching with `useFetch` that RE-RUNS when its
       reactive query changes. (No manual cache bust needed — Nuxt diffs
       the `key` and refetches automatically.)
    3. Two-way binding filters to the URL so the page is shareable/back-
       navigable. Open /products?q=keyboard&category=electronics to see it.

  NEXT.JS ANALOGY
  ---------------
  Next.js App Router: `const searchParams = useSearchParams()` + a manual
  `router.replace(...?...)` on change, plus React Query for fetching.
  In Nuxt this all collapses into `useFetch('/api/products', { query })`
  where `query` is a reactive object. Nuxt handles caching + refetching.
-->
<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ $t('products.title') }}</h1>
        <p class="text-sm text-gray-500">
          {{ data?.total ?? 0 }} results · page {{ page }} of {{ totalPages }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="grid sm:grid-cols-4 gap-3">
        <UInput
          v-model="q"
          :placeholder="$t('products.search')"
          icon="i-lucide-search"
        />

        <USelectMenu
          v-model="category"
          :options="categoryOptions"
          value-attribute="value"
          option-attribute="label"
          :placeholder="$t('products.category')"
        />

        <USelectMenu
          v-model="sort"
          :options="sortOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Sort"
        />

        <UButton variant="soft" color="gray" icon="i-lucide-x" @click="resetFilters">
          Reset
        </UButton>
      </div>
    </UCard>

    <!-- Results -->
    <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <USkeleton v-for="i in 6" :key="i" class="h-64 w-full" />
    </div>

    <div v-else-if="error" class="text-red-500">
      Failed to load products: {{ error.message }}
    </div>

    <div v-else-if="!data?.items.length" class="text-center py-16 text-gray-500">
      {{ $t('products.empty') }}
    </div>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="p in data.items"
        :key="p.id"
        :to="localePath(`/products/${p.id}`)"
        class="block"
      >
        <UCard class="hover:border-primary transition h-full">
          <template #header>
            <img
              :src="p.image"
              :alt="p.title"
              loading="lazy"
              class="aspect-[3/2] w-full object-cover rounded-md"
            />
          </template>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <UBadge variant="subtle" size="xs">{{ p.category }}</UBadge>
              <div class="text-xs text-gray-500">★ {{ p.rating }}</div>
            </div>
            <h3 class="font-semibold leading-tight">{{ p.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ p.description }}</p>
            <p class="font-mono text-sm">${{ p.price }}</p>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="data && totalPages > 1" class="flex justify-center pt-2">
      <UPagination v-model="page" :page-count="limit" :total="data.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~~/server/utils/fakeDb'

useHead({ title: 'Products · Nuxt Learning Lab' })

const { t } = useI18n()
const localePath = useLocalePath()

// `useRoute` → current route (like Next.js `useSearchParams` + `usePathname`
// combined). `useRouter` → programmatic navigation (`router.push/replace`).
const route = useRoute()
const router = useRouter()

// --- filter state bound to the URL -------------------------------------
// We seed these refs from the current URL so the page is shareable and
// the browser back button restores filters correctly. Then we `watch`
// them and push a new URL whenever they change.
const q = ref((route.query.q as string) ?? '')
const category = ref((route.query.category as string) ?? '')
const sort = ref((route.query.sort as string) ?? '')
const page = ref(Number(route.query.page) || 1)
const limit = 6

const categoryOptions = [
  { value: '', label: t('products.all') },
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel',     label: 'Apparel' },
  { value: 'home',        label: 'Home' },
  { value: 'beauty',      label: 'Beauty' }
]

const sortOptions = [
  { value: '',           label: 'Default' },
  { value: 'price-asc',  label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating',     label: 'Rating' }
]

// Reset page to 1 whenever a filter changes — avoids landing on page 5
// of a search that now only has 1 page of results.
watch([q, category, sort], () => { page.value = 1 })

// --- sync state → URL --------------------------------------------------
// `watch` is Vue's `useEffect` with explicit dependencies. Each watched
// ref is tracked; the callback fires when any of them change.
watch([q, category, sort, page], () => {
  const query: Record<string, string> = {}
  if (q.value) query.q = q.value
  if (category.value) query.category = category.value
  if (sort.value) query.sort = sort.value
  if (page.value > 1) query.page = String(page.value)
  // `replace: true` = don't bloat browser history with every keystroke.
  router.replace({ query })
})

// --- fetch -------------------------------------------------------------
// `useFetch` is Nuxt's SSR-aware data loader. On the server it runs during
// render; on the client it hydrates from the server's payload. It also
// re-runs automatically when any reactive value inside `query`/`key` changes.
//
// Pass `query` as a reactive object (computed) so changes drive refetches.
// `pending` ↔ React Query's `isLoading`, `error` ↔ `error`, `data` ↔ `data`.
const { data, pending, error } = await useFetch<{
  items: Product[]
  total: number
  offset: number
  limit: number
}>('/api/products', {
  query: computed(() => ({
    q: q.value || undefined,
    category: category.value || undefined,
    sort: sort.value || undefined,
    limit,
    offset: (page.value - 1) * limit
  })),
  // `key` disambiguates the cache entry — useful when you have multiple
  // `useFetch` calls hitting the same URL with different intents.
  key: 'products-list'
})

const totalPages = computed(() =>
  data.value ? Math.max(1, Math.ceil(data.value.total / limit)) : 1
)

function resetFilters() {
  q.value = ''
  category.value = ''
  sort.value = ''
  page.value = 1
}
</script>
