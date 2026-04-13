// https://nuxt.com/docs/api/configuration/nuxt-config
//
// NEXT.JS ANALOGY
// ---------------
// This file is to Nuxt what `next.config.js` is to Next.js. It also holds
// things you'd put in `layout.tsx` (global CSS), `providers.tsx` (modules),
// and `middleware.ts` (route rules) in a Next.js App Router project.
//
// `defineNuxtConfig` is a global — you don't need to import it. Nuxt
// auto-imports it (and most other Nuxt APIs) at build time.

export default defineNuxtConfig({
  // Enables strict Vue devtools + better error overlays in dev.
  devtools: { enabled: true },

  // `modules` is Nuxt's plugin system. Each module can add auto-imports,
  // components, server routes, pages, etc. Think of this like wiring up
  // `@next/bundle-analyzer` + NextAuth + next-intl all at once.
  modules: [
    '@nuxt/ui',        // Tailwind + Headless UI components (auto-registered)
    '@nuxtjs/i18n',    // Localized routing & translations
    '@pinia/nuxt'      // Pinia store (Vue's Zustand/Redux equivalent)
  ],

  // Global CSS. Files listed here are injected into every page — like
  // importing `globals.css` in `app/layout.tsx` in Next.js.
  css: ['~/assets/css/main.css'],

  // --- i18n ---------------------------------------------------------------
  // Same idea as `next-intl`. `strategy: 'prefix_except_default'` means:
  //   /about      → English (default)
  //   /es/about   → Spanish
  // You get `useI18n()` in any component, similar to next-intl's hooks.
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'es', name: 'Español', file: 'es.json' }
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default'
  },

  // --- Runtime config -----------------------------------------------------
  // `runtimeConfig` is Nuxt's equivalent of `process.env` handling.
  // Keys at the top level are SERVER-ONLY (never shipped to the browser).
  // Keys under `public` are exposed to the client. Access them in code via
  // `useRuntimeConfig()` — same pattern as Next.js's `process.env` + public
  // env prefix, but typed and centralized.
  runtimeConfig: {
    // Server-only. Used to sign our fake JWT tokens.
    jwtSecret: process.env.JWT_SECRET || 'dev-only-super-secret-change-me',
    public: {
      // Exposed to the browser. Prefix with something obvious.
      appName: 'Nuxt Learning Lab'
    }
  },

  // --- Nitro (server engine) ----------------------------------------------
  // Nitro is Nuxt's server. It's what runs your `server/api/*` files.
  // The `preset` decides which platform to build for. Cloudflare Pages has
  // a native preset — no opennext-style adapter needed.
  nitro: {
    preset: 'cloudflare_pages',
    // `routeRules` is Nuxt's version of Next.js `middleware.ts` + route
    // segment `revalidate`. You declaratively say how each URL should be
    // cached, redirected, or rendered. `swr` = Stale-While-Revalidate.
    routeRules: {
      // Cache the public products list at the edge for 60s.
      '/api/products': { swr: 60 },
      // Force SPA rendering for the dashboard (no SSR leaking auth state).
      '/dashboard': { ssr: false }
    }
  },

  // Dark mode preference — Nuxt UI reads this.
  colorMode: {
    preference: 'dark'
  },

  // Pins a compatibility date so Nuxt/Nitro features don't shift under you.
  compatibilityDate: '2025-01-01'
})
