<!--
  Components in /components are AUTO-IMPORTED by Nuxt. You don't write
  `import AppHeader from ...` anywhere — just use <AppHeader /> in any
  template. Think of it as an opinionated version of Next.js barrel imports.

  Nested folders become prefixes, so components/forms/LoginForm.vue becomes
  <FormsLoginForm />. Keep that in mind when naming.
-->
<template>
  <header class="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
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
        <UButton variant="ghost" :to="localePath('/dashboard')">{{ $t('nav.dashboard') }}</UButton>
      </nav>

      <!--
        Language switcher. `useI18n()` returns a reactive `locale` ref
        (Vue's version of `useState`). Writing to it updates the URL,
        re-runs route-aware fetches, and persists to a cookie.
      -->
      <USelectMenu
        v-model="locale"
        :options="localeOptions"
        value-attribute="code"
        option-attribute="name"
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

// `useI18n` from @nuxtjs/i18n. `locale` is a ref — mutate to switch language.
const { locale, locales } = useI18n()
const localePath = useLocalePath()

// `locales` is typed as an array of locale objects OR strings depending on
// config. Normalize to an object shape for the dropdown.
const localeOptions = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map(l => ({
    code: l.code,
    name: l.name
  }))
)

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  auth.logout()
  await router.push(localePath('/'))
}
</script>
