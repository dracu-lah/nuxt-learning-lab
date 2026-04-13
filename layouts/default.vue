<!--
  The "default" layout. Every page that doesn't override `layout` uses this.

  NEXT.JS ANALOGY: this is your `app/(public)/layout.tsx` — the persistent
  shell around route content. The <slot /> below is where the matched page
  is injected (Vue's equivalent of React's `{children}`).
-->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <AppHeader />

    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>

    <footer class="mx-auto max-w-5xl px-4 py-10 text-xs text-gray-500">
      Built with Nuxt 3 · {{ config.public.appName }}
    </footer>
  </div>
</template>

<script setup lang="ts">
// `useRuntimeConfig()` is Nuxt's typed env helper. Anything under `public`
// in nuxt.config.ts is accessible on both server and client.
const config = useRuntimeConfig()
</script>
