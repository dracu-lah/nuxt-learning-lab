<!--
  Components in /app/components are AUTO-IMPORTED by Nuxt. You don't write
  `import AppHeader from ...` anywhere — just use <AppHeader /> in any
  template. Think of it as an opinionated version of Next.js barrel imports.

  Nested folders become prefixes, so components/forms/LoginForm.vue becomes
  <FormsLoginForm />. Keep that in mind when naming.
-->
<template>
  <header class="border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur">
    <div class="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
      <!--
        <NuxtLink> is Nuxt's <Link>. It handles locale prefixing automatically
        thanks to @nuxtjs/i18n — never hard-code `/es/...`. Use `localePath()`
        (below) when you need the resolved path as a string.
      -->
      <NuxtLink :to="localePath('/')" class="font-semibold tracking-tight">
        {{ $t('home.title') }}
      </NuxtLink>

      <nav class="flex-1 flex items-center gap-1 text-sm">
        <UButton variant="ghost" :to="localePath('/')">{{ $t('nav.home') }}</UButton>
        <UButton variant="ghost" :to="localePath('/products')">{{ $t('nav.products') }}</UButton>
        <UButton variant="ghost" :to="localePath('/fruits')">{{ $t('nav.fruits') }}</UButton>
        <UButton variant="ghost" :to="localePath('/pricing')">{{ $t('nav.pricing') }}</UButton>
        <UButton variant="ghost" :to="localePath('/dashboard')">{{ $t('nav.dashboard') }}</UButton>
        <!--
          Cart link with item-count badge. `cart.count` is a Pinia getter
          (computed) — it auto-updates as items are added/removed.
        -->
        <UButton
          variant="ghost"
          :to="localePath('/cart')"
          icon="i-lucide-shopping-cart"
        >
          {{ $t('nav.cart') }}
          <UBadge v-if="cart.count" size="xs" class="ms-1">{{ cart.count }}</UBadge>
        </UButton>
      </nav>

      <!--
        Dark/light/system toggle. <UColorModeButton> is shipped by Nuxt UI v4
        and wires up `useColorMode()` for you — clicking cycles through
        light/dark and respects the system preference fallback configured
        in `nuxt.config.ts`.
      -->
      <UColorModeButton />

      <!--
        Language switcher. `useI18n()` returns a reactive `locale` ref.
        v4 USelectMenu API: pass `:items` (array of {label, value}) and
        bind `v-model` to the `value` field via `value-key`.
      -->
      <USelectMenu
        v-model="selectedLocale"
        :items="localeItems"
        value-key="value"
        size="xs"
        class="w-28"
      />

      <!--
        Auth state lives in the Pinia `auth` store. We read it via the
        composable `useAuthStore()` (auto-imported from /stores).
        `v-if` / `v-else` are Vue's inline conditional rendering.
      -->
      <template v-if="auth.isAuthenticated">
        <UButton size="xs" variant="soft" @click="handleLogout">
          {{ $t('nav.logout') }}
        </UButton>
      </template>
      <template v-else>
        <UButton size="xs" :to="localePath('/auth/login')">
          {{ $t('nav.login') }}
        </UButton>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

// `useI18n` from @nuxtjs/i18n. `locale` is a ref — mutate to switch language.
const { locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

// USelectMenu v4 wants `{ label, value }` items.
const localeItems = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    label: l.name,
    value: l.code
  }))
)

// Two-way bridge between USelectMenu's selection (the locale code) and
// vue-i18n's `locale` ref. Using `setLocale()` triggers the proper i18n
// route swap instead of just mutating the ref.
const selectedLocale = computed({
  get: () => locale.value,
  set: (code: string) => setLocale(code as 'en' | 'es')
})

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

async function handleLogout() {
  auth.logout()
  await router.push(localePath('/'))
}
</script>
