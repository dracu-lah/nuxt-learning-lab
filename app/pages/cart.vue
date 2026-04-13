<!--
  /cart — the second protected route in this app.

  Pattern reference
  -----------------
  Marking a page as "auth required" is a one-line opt-in: list the
  middleware in `definePageMeta()`. Same convention as `/dashboard` —
  use this as a template for any future protected page.

  The cart store itself is happy to operate without a logged-in user
  (so a guest can browse and stack items), but viewing the cart page
  requires an account, which mirrors a typical e-commerce checkout flow.
-->
<template>
  <div class="space-y-6">
    <div class="flex items-baseline justify-between gap-4">
      <h1 class="text-3xl font-bold tracking-tight">{{ $t('cart.title') }}</h1>
      <UButton
        v-if="!cart.isEmpty"
        variant="ghost"
        size="xs"
        icon="i-lucide-trash-2"
        @click="cart.clear"
      >
        {{ $t('cart.clear') }}
      </UButton>
    </div>

    <UCard v-if="cart.isEmpty">
      <p class="text-gray-500">{{ $t('cart.empty') }}</p>
      <template #footer>
        <UButton :to="localePath('/products')" icon="i-lucide-arrow-right">
          {{ $t('home.cta') }}
        </UButton>
      </template>
    </UCard>

    <template v-else>
      <UCard
        v-for="item in cart.items"
        :key="item.id"
        :ui="{ body: 'p-4 sm:p-4' }"
      >
        <div class="flex items-center gap-4">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-20 h-20 rounded object-cover"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ item.title }}</p>
            <p class="text-sm text-gray-500 font-mono">${{ item.price }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              size="xs"
              variant="ghost"
              icon="i-lucide-minus"
              :aria-label="$t('cart.qty')"
              @click="cart.setQty(item.id, item.qty - 1)"
            />
            <span class="w-6 text-center tabular-nums">{{ item.qty }}</span>
            <UButton
              size="xs"
              variant="ghost"
              icon="i-lucide-plus"
              :aria-label="$t('cart.qty')"
              @click="cart.setQty(item.id, item.qty + 1)"
            />
          </div>
          <UButton
            size="xs"
            color="error"
            variant="ghost"
            icon="i-lucide-x"
            :aria-label="$t('cart.remove')"
            @click="cart.remove(item.id)"
          />
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between text-lg">
          <span>{{ $t('cart.subtotal') }}</span>
          <span class="font-mono font-bold">${{ cart.subtotal.toFixed(2) }}</span>
        </div>
        <template #footer>
          <UButton size="lg" block icon="i-lucide-credit-card">
            {{ $t('cart.checkout') }}
          </UButton>
        </template>
      </UCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

// One-line opt-in to the auth middleware. Identical to /dashboard.
definePageMeta({
  middleware: ['auth']
})

const cart = useCartStore()
const localePath = useLocalePath()

useHead({ title: 'Cart' })
</script>
