<!--
  layouts/auth.vue — sidebar layout used only by /auth/login and /auth/register.

  Pages opt in via:
      definePageMeta({ layout: 'auth' })

  This is the second layout in the project (default.vue is the public one).
  It demonstrates the multi-layout pattern: instead of a single shell with
  conditional rendering, Nuxt picks the layout file by name and the
  matched page slots into <slot />.
-->
<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-(--ui-bg)">
    <!-- Branded sidebar -->
    <aside
      class="md:w-2/5 lg:w-1/3 p-8 flex flex-col justify-between
             bg-gradient-to-br from-(--ui-primary) to-red-900 text-white
             relative overflow-hidden"
    >
      <!-- Decorative blob -->
      <div class="absolute -top-20 -end-20 w-72 h-72 bg-white/10 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-20 -start-20 w-72 h-72 bg-white/5 blur-3xl pointer-events-none" />

      <NuxtLink :to="localePath('/')" class="relative font-bold text-xl tracking-tight">
        {{ $t('home.title') }}
      </NuxtLink>

      <div class="relative space-y-4 hidden md:block">
        <h2 class="text-3xl font-bold leading-tight">{{ $t('auth.sidebarHeadline') }}</h2>
        <p class="text-white/80">{{ $t('auth.sidebarSubtitle') }}</p>
        <ul class="space-y-2 pt-4">
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" />
            <span>{{ $t('auth.bullet1') }}</span>
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" />
            <span>{{ $t('auth.bullet2') }}</span>
          </li>
          <li class="flex items-center gap-2">
            <UIcon name="i-lucide-check-circle" />
            <span>{{ $t('auth.bullet3') }}</span>
          </li>
        </ul>
      </div>

      <p class="relative text-xs text-white/60">
        © {{ year }} {{ $t('home.title') }}
      </p>
    </aside>

    <!-- Form area -->
    <main class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const year = new Date().getFullYear()
</script>
