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

// Site-wide SEO defaults. `ogImage` is resolved against `site.url` from
// nuxt.config.ts, so `/og-image.png` becomes an absolute URL in the meta
// tag — and @nuxtjs/sitemap's `discoverImages` picks it up for every
// route in sitemap.xml under the <image:image> namespace.
useSeoMeta({
  title: 'Nuxt Learning Lab',
  description:
    'A hands-on Nuxt 4 playground exploring Nuxt UI v4, i18n, Pinia, and Cloudflare Workers deploys.',
  ogSiteName: 'Nuxt Learning Lab',
  ogType: 'website',
  ogUrl: 'https://nuxt-learning-lab.dracu.workers.dev',
  ogTitle: 'Nuxt Learning Lab',
  ogDescription:
    'A hands-on Nuxt 4 playground exploring Nuxt UI v4, i18n, Pinia, and Cloudflare Workers deploys.',
  ogImage: '/og-image.png',
  ogImageType: 'image/png',
  ogImageWidth: 1904,
  ogImageHeight: 1005,
  ogImageAlt: 'Nuxt Learning Lab',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nuxt Learning Lab',
  twitterDescription:
    'A hands-on Nuxt 4 playground exploring Nuxt UI v4, i18n, Pinia, and Cloudflare Workers deploys.',
  twitterImage: '/og-image.png',
  twitterImageAlt: 'Nuxt Learning Lab'
})
</script>
