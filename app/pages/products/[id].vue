<!--
  /products/:id — Dynamic route demo.

  The bracketed filename creates a route param. Read it via `route.params.id`.
  We also show how to handle the 404 case via `createError` returned from
  `useFetch` and rendered with `<NuxtErrorBoundary>` style fallback.
-->
<template>
  <div class="space-y-6">
    <UButton variant="ghost" icon="i-lucide-arrow-left" :to="localePath('/products')">
      Back to products
    </UButton>

    <USkeleton v-if="pending" class="h-96 w-full" />

    <div v-else-if="error" class="text-red-500">
      {{ error.statusMessage || 'Error loading product' }}
    </div>

    <UCard v-else-if="data">
      <div class="grid md:grid-cols-2 gap-6">
        <img
          :src="data.image"
          :alt="data.title"
          class="rounded-md w-full aspect-[3/2] object-cover"
        />
        <div class="space-y-3">
          <UBadge variant="subtle">{{ data.category }}</UBadge>
          <h1 class="text-3xl font-bold tracking-tight">{{ data.title }}</h1>
          <p class="text-gray-500">{{ data.description }}</p>
          <p class="text-2xl font-mono">${{ data.price }}</p>
          <div class="text-sm text-gray-500">★ {{ data.rating }}</div>
          <UButton
            size="lg"
            icon="i-lucide-shopping-cart"
            @click="handleAdd"
          >
            {{ $t('cart.add') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~~/server/utils/fakeDb'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const toast = useToast()

const cart = useCartStore()

// Template literal in the URL works because `route.params.id` is a string.
// For reactive params (e.g. shallow-routed pages), wrap in a `computed()`
// and pass via `key` + `watch` to refetch.
const { data, pending, error } = await useFetch<Product>(
  () => `/api/products/${route.params.id}`
)

function handleAdd() {
  if (!data.value) return
  cart.add(data.value)
  // `useToast()` is from Nuxt UI — quick feedback after the mutation.
  // v4 uses semantic color names: success/info/warning/error/primary/neutral.
  toast.add({ title: t('cart.added'), color: 'success' })
}

useHead({
  title: () => (data.value ? `${data.value.title} · Products` : 'Product')
})
</script>
