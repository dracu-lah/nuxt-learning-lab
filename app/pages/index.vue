<!--
  pages/index.vue  →  URL `/`
  pages/products/index.vue  →  `/products`
  pages/products/[id].vue   →  `/products/:id`
  pages/auth/login.vue      →  `/auth/login`

  Nuxt's file-based router is nearly identical to Next.js Pages Router.
  (App Router folks: no `page.tsx`/`layout.tsx` split here — a `.vue` file
  under /pages is the page.)

  Every <script setup> composition function runs ONCE per navigation.
-->
<template>
  <div class="space-y-8">
    <section class="text-center space-y-4 py-10">
      <UBadge color="primary" variant="soft" size="lg">Nuxt 3 + Nitro + Nuxt UI</UBadge>
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
        {{ $t('home.title') }}
      </h1>
      <p class="text-lg text-gray-500 max-w-2xl mx-auto">
        {{ $t('home.subtitle') }}
      </p>
      <div class="flex justify-center gap-2 pt-2">
        <UButton size="lg" :to="localePath('/products')" icon="i-lucide-arrow-right" trailing>
          {{ $t('home.cta') }}
        </UButton>
        <UButton size="lg" variant="outline" :to="localePath('/auth/login')">
          {{ $t('nav.login') }}
        </UButton>
      </div>
    </section>

    <!--
      Teaching grid — clickable cards that link to each feature page so
      you can learn by poking. Each card is a <NuxtLink> wrapped in a <UCard>.
    -->
    <section class="grid sm:grid-cols-2 gap-4">
      <NuxtLink :to="localePath('/products')" class="block">
        <UCard class="hover:border-primary transition">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-search" class="text-primary text-2xl" />
            <div>
              <h3 class="font-semibold">Search params demo</h3>
              <p class="text-sm text-gray-500">Two-way URL sync with <code>useRoute</code> + <code>useFetch</code>.</p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink :to="localePath('/dashboard')" class="block">
        <UCard class="hover:border-primary transition">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-lock" class="text-primary text-2xl" />
            <div>
              <h3 class="font-semibold">Protected route</h3>
              <p class="text-sm text-gray-500">Auth middleware + Pinia + localStorage token.</p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink :to="localePath('/auth/login')" class="block">
        <UCard class="hover:border-primary transition">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-log-in" class="text-primary text-2xl" />
            <div>
              <h3 class="font-semibold">Email / password auth</h3>
              <p class="text-sm text-gray-500">Zod-validated server routes + JWT-ish token.</p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <UCard>
        <div class="flex items-start gap-3">
          <UIcon name="i-lucide-languages" class="text-primary text-2xl" />
          <div>
            <h3 class="font-semibold">Localization</h3>
            <p class="text-sm text-gray-500">Switch language from the top-right menu.</p>
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
// `useHead` injects into <head> — same job as Next.js `metadata` + `<Head>`.
useHead({ title: 'Home · Nuxt Learning Lab' })

// `useLocalePath()` converts a logical path to a locale-prefixed one
// (e.g. `/products` → `/es/products` when the current locale is `es`).
const localePath = useLocalePath()
</script>
