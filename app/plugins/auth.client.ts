// Client-only plugin: rehydrate the auth session from localStorage on
// app start, BEFORE the first page renders.
//
// NEXT.JS ANALOGY
// ---------------
// Plugins under /plugins run once during Nuxt's bootstrap, similar to
// Next.js `app/providers.tsx` wrapping children in context providers.
// The `.client.ts` suffix marks this plugin as browser-only — Nuxt won't
// try to run it during SSR. (`.server.ts` is the inverse.)
//
// We need this because:
//   - The token lives in localStorage (browser-only).
//   - We want `auth.user` populated before any page that depends on it
//     finishes mounting, so the UI doesn't flash "logged out → logged in".

import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  // Awaiting this delays the first paint slightly until /api/me responds.
  // Acceptable trade-off for a teaching app; in production you might
  // render an immediate skeleton and resolve auth in the background.
  await auth.fetchMe()
})
