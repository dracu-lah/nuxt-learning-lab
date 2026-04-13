<!--
  app.vue is the ROOT component. It's the closest analog to Next.js
  `app/layout.tsx`. Everything renders inside it.

  The two key Nuxt-isms here:
    <NuxtLayout>  →  picks the layout file from /layouts based on the
                     `definePageMeta({ layout: 'foo' })` of the active page.
                     Defaults to /layouts/default.vue.
    <NuxtPage>    →  the active route's component (like Next.js {children}).

  Nuxt UI also requires <UApp> to mount its toaster/modals.
-->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
