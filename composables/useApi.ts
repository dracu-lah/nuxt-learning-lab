// A thin wrapper around `$fetch` that automatically attaches the auth
// token. Use this from components/stores whenever you need an
// authenticated request.
//
// NEXT.JS ANALOGY
// ---------------
// This is the "authed fetcher" pattern. Same thing you'd build with axios
// interceptors or a `fetchWithAuth()` helper in a Next.js project.
//
// Files under /composables are AUTO-IMPORTED. Prefix with `use` by Vue
// convention (like React hooks). You can call `useApi()` from anywhere in
// the app tree without explicit imports.

import { useAuthStore } from '~/stores/auth'

export function useApi() {
  const auth = useAuthStore()

  // `$fetch.create` builds a pre-configured `$fetch` instance. The
  // onRequest hook runs before each request, letting us inject headers.
  const api = $fetch.create({
    onRequest({ options }) {
      if (auth.token) {
        // `options.headers` can be a Headers instance, a plain object, or
        // undefined — normalize to a Headers instance before setting.
        const headers = new Headers(options.headers as HeadersInit | undefined)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      // 401 means our token is stale — wipe local session so the UI
      // reflects reality and future requests don't keep re-failing.
      if (response.status === 401) auth.logout()
    }
  })

  return api
}
