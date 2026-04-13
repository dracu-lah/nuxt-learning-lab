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

// Tailwind v4's Vite plugin compiles the CSS-first config (the `@theme`
// block in `app/assets/css/main.css`). v4 dropped the JS config file —
// no `tailwind.config.ts` exists in this repo by design.
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Enables strict Vue devtools + better error overlays in dev.
  devtools: { enabled: true },

  // `modules` is Nuxt's plugin system. Each module can add auto-imports,
  // components, server routes, pages, etc. Think of this like wiring up
  // `@next/bundle-analyzer` + NextAuth + next-intl all at once.
  modules: [
    '@nuxt/ui',         // Tailwind v4 + Reka UI components (auto-registered)
    '@nuxt/fonts',      // Auto-downloads + self-hosts any font referenced in CSS
    '@nuxtjs/i18n',     // Localized routing & translations
    '@nuxtjs/sitemap',  // Generates /sitemap.xml from your pages + i18n routes
    '@nuxtjs/robots',   // Generates /robots.txt and links to the sitemap
    '@pinia/nuxt'       // Pinia store (Vue's Zustand/Redux equivalent)
  ],

  // Global CSS. Files listed here are injected into every page — like
  // importing `globals.css` in `app/layout.tsx` in Next.js.
  // The Tailwind v4 directives + `@theme` block live in main.css.
  css: ['~/assets/css/main.css'],

  // --- Vite -------------------------------------------------------------
  // Tailwind v4 is configured via a Vite plugin (no PostCSS file needed).
  vite: {
    plugins: [tailwindcss()]
  },

  // --- i18n ---------------------------------------------------------------
  // Same idea as `next-intl`. `strategy: 'prefix_except_default'` means:
  //   /about      → English (default)
  //   /es/about   → Spanish
  // You get `useI18n()` in any component, similar to next-intl's hooks.
  i18n: {
    // `dir` controls the writing direction. @nuxtjs/i18n exposes it via
    // `useLocaleHead()` so we can bind `<html dir="rtl">` from app.vue.
    locales: [
      { code: 'en', name: 'English',  language: 'en-US', file: 'en.json', dir: 'ltr' },
      { code: 'es', name: 'Español',  language: 'es-ES', file: 'es.json', dir: 'ltr' },
      { code: 'ar', name: 'العربية', language: 'ar-SA', file: 'ar.json', dir: 'rtl' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false
    }
  },

  // --- Site identity -----------------------------------------------------
  // Used by @nuxtjs/sitemap, @nuxtjs/robots, and useSeoMeta to generate
  // canonical URLs, sitemap entries, and OG tags. One source of truth.
  site: {
    url: 'https://nuxt-learning-lab.pages.dev',
    name: 'Nuxt Learning Lab'
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
    preset: 'cloudflare_module',
    // `routeRules` is Nuxt's version of Next.js `middleware.ts` + route
    // segment `revalidate`. You declaratively say how each URL should be
    // cached, redirected, or rendered. `swr` = Stale-While-Revalidate.
    routeRules: {
      // Cache the public products list at the edge for 60s.
      '/api/products': { swr: 60 },
      // Force SPA rendering for the dashboard and cart (no SSR leaking
      // auth state, and the cart is a client-only Pinia store anyway).
      '/dashboard': { ssr: false },
      '/cart': { ssr: false }
    }
  },

  // Dark mode default. `system` honors the OS setting; the user can
  // override via the <UColorModeButton> in the header.
  colorMode: {
    preference: 'system',
    fallback: 'dark'
  },

  // Pins a compatibility date so Nuxt/Nitro features don't shift under you.
  compatibilityDate: '2026-04-13'
})
