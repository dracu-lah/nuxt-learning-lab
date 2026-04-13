<!--
  app.vue is the ROOT component. It's the closest analog to Next.js
  `app/layout.tsx`. Everything renders inside it.

  The two key Nuxt-isms here:
    <NuxtLayout>  →  picks the layout file from /layouts based on the
                     `definePageMeta({ layout: 'foo' })` of the active page.
                     Defaults to /layouts/default.vue.
    <NuxtPage>    →  the active route's component (like Next.js {children}).

  Nuxt UI also requires <UApp> to mount its toaster/modals.

  RTL handling
  ------------
  When the user switches to Arabic via the language menu, we want the
  whole page to flip to right-to-left. @nuxtjs/i18n exposes the per-
  locale `dir` (set in nuxt.config.ts) via `useLocaleHead()`. We feed
  that into `useHead({ htmlAttrs })` so `<html dir="rtl">` is emitted
  on the SSR response *and* updated on the client when the locale
  changes — Tailwind's logical properties (`ms-*`, `me-*`, `ps-*`,
  `start-*`) and the `rtl:` modifier do the rest.
-->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const head = useLocaleHead({ dir: true, lang: true })

useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang ?? 'en',
    dir:  () => head.value.htmlAttrs?.dir  ?? 'ltr'
  }
})
</script>
