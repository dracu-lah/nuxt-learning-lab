// Route middleware: redirects unauthenticated users away from protected
// pages.
//
// NEXT.JS ANALOGY
// ---------------
// Next.js has ONE root `middleware.ts` for all routes. Nuxt instead has
// per-route middleware files in /middleware. You opt a page into a
// middleware by adding `definePageMeta({ middleware: ['auth'] })` in that
// page's <script setup>. (Append `.global.ts` to the filename to make it
// run on EVERY route automatically — like the Next.js root middleware.)
//
// Middleware runs both on the server (during SSR) and on the client
// (during client-side navigation). Be careful with browser-only APIs:
// guard with `import.meta.client`.

import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const localePath = useLocalePath()

  // On the server-rendered first paint, the localStorage-backed token
  // hasn't been loaded yet — so `isAuthenticated` will be false even for
  // logged-in users. Skip the check during SSR and let the client decide.
  // (We also disable SSR for /dashboard via routeRules in nuxt.config.ts,
  //  but this guard makes the middleware safe on any protected page.)
  if (import.meta.server) return

  if (!auth.isAuthenticated) {
    // `navigateTo` is the redirect helper. Returning it from middleware
    // tells Nuxt to perform the navigation instead of rendering the page.
    return navigateTo({
      path: localePath('/auth/login'),
      query: { redirect: to.fullPath }
    })
  }
})
