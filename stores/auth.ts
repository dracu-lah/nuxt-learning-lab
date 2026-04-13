// Pinia store for auth.
//
// NEXT.JS / REACT ANALOGY
// -----------------------
// Pinia is Vue's Zustand. `defineStore('id', () => { ... })` is roughly
// `create((set, get) => ({ ... }))`. The big difference is that you read
// state via `ref()` instead of plain values — refs are Vue's reactive
// primitives. Use `.value` to read/write them in JS, but in templates
// Vue unwraps refs automatically (so you write `auth.user`, not `auth.user.value`).
//
// This store:
//   - Holds the current user + token.
//   - Persists the token in localStorage (browser only).
//   - Hydrates state on app start via /plugins/auth.client.ts.
//   - Exposes `login`, `register`, `logout`, `fetchMe`.

import { defineStore } from 'pinia'

export type AuthUser = { id: string; email: string; name: string }

const STORAGE_KEY = 'nll.token'

export const useAuthStore = defineStore('auth', () => {
  // --- state ------------------------------------------------------------
  // `ref()` creates a reactive value. `useState` from Nuxt is similar but
  // SSR-aware — for client-only auth state, plain `ref` is fine.
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // --- getters ----------------------------------------------------------
  // `computed()` is exactly React's `useMemo` — derived reactive value.
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // --- helpers ----------------------------------------------------------
  function persist(t: string | null) {
    // `import.meta.client` is Nuxt's SSR-safe "are we in the browser?" check.
    // It's the equivalent of `typeof window !== 'undefined'`.
    if (!import.meta.client) return
    if (t) localStorage.setItem(STORAGE_KEY, t)
    else localStorage.removeItem(STORAGE_KEY)
  }

  function setSession(payload: { token: string; user: AuthUser }) {
    token.value = payload.token
    user.value = payload.user
    persist(payload.token)
  }

  // --- actions ----------------------------------------------------------
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      // `$fetch` is Nuxt's universal HTTP client (works on server + client).
      // It's like axios + ofetch + native fetch with sane defaults. For
      // mutations, prefer `$fetch` over `useFetch` — `useFetch` is built
      // for SSR-aware data loading on page setup.
      const res = await $fetch<{ token: string; user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      setSession(res)
    } catch (e: any) {
      error.value = e?.data?.statusMessage ?? e?.statusMessage ?? 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, name: string) {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<{ token: string; user: AuthUser }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, name }
      })
      setSession(res)
    } catch (e: any) {
      error.value = e?.data?.statusMessage ?? e?.statusMessage ?? 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Called on app start (see /plugins/auth.client.ts) to rehydrate the
  // session from localStorage and verify it against /api/me.
  async function fetchMe() {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    token.value = stored
    try {
      const me = await $fetch<AuthUser>('/api/me', {
        headers: { Authorization: `Bearer ${stored}` }
      })
      user.value = me
    } catch {
      // Token invalid/expired → clear it so the user sees the login UI.
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    persist(null)
  }

  return {
    user, token, loading, error, isAuthenticated,
    login, register, logout, fetchMe
  }
})
