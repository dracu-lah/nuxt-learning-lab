# Nuxt Learning Lab

A guided Nuxt 3 starter built **for Next.js developers**. Every file is heavily commented to explain *why* it exists and *how it maps to the Next.js world you already know*.

It demonstrates, in one project:

- File-based routing (pages, dynamic segments, nested folders)
- Layouts and the root `app.vue`
- Auto-imports for components, composables, stores
- `useFetch` + URL-driven search params
- Server API routes (Nitro) with Zod validation
- Email/password auth with token in `localStorage`
- Protected pages via route middleware
- Pinia state management
- Internationalization with `@nuxtjs/i18n`
- Cloudflare Pages deployment

---

## 1. Run it

```bash
pnpm install        # installs deps + runs `nuxt prepare` (generates types)
pnpm dev            # starts on http://localhost:5342
```

Demo account (pre-seeded):

- **Email:** `demo@nuxt.dev`
- **Password:** `password`

---

## 2. Project tour (and how to read it)

Open the files in this order — each one builds on the previous:

| Order | File | What you learn |
|---|---|---|
| 1 | `nuxt.config.ts` | Modules, env, i18n, Nitro/Cloudflare, route rules |
| 2 | `app.vue` | The root component (`<NuxtLayout>` + `<NuxtPage>`) |
| 3 | `layouts/default.vue` | Persistent shell, equivalent to `app/layout.tsx` |
| 4 | `components/AppHeader.vue` | Auto-imported components, `<NuxtLink>`, `useI18n` |
| 5 | `pages/index.vue` | Basic page, `useHead`, locale-aware links |
| 6 | `server/utils/fakeDb.ts` | In-memory DB shared across server routes |
| 7 | `server/api/products/index.get.ts` | GET handler with Zod query validation |
| 8 | `server/api/products/[id].get.ts` | Dynamic route param |
| 9 | `pages/products/index.vue` | **Search params demo** — URL ↔ filter state |
| 10 | `pages/products/[id].vue` | Dynamic page with reactive `useFetch` |
| 11 | `server/utils/token.ts` | Edge-compatible HMAC token signing |
| 12 | `server/api/auth/login.post.ts` | POST with `readValidatedBody` |
| 13 | `server/api/me.get.ts` | Reading the `Authorization` header |
| 14 | `stores/auth.ts` | Pinia store with localStorage persistence |
| 15 | `composables/useApi.ts` | Authed `$fetch` wrapper (interceptor pattern) |
| 16 | `middleware/auth.ts` | Per-route guard via `defineNuxtRouteMiddleware` |
| 17 | `plugins/auth.client.ts` | Bootstrap session before first paint |
| 18 | `pages/auth/login.vue` | Form + Pinia action + redirect |
| 19 | `pages/dashboard.vue` | Protected page (`definePageMeta({ middleware: ['auth'] })`) |

---

## 3. Next.js → Nuxt cheatsheet

This is the only table you'll actually need to keep handy.

| Concept | Next.js | Nuxt 3 |
|---|---|---|
| Config | `next.config.js` | `nuxt.config.ts` |
| Root layout | `app/layout.tsx` | `app.vue` + `layouts/default.vue` |
| Page | `app/foo/page.tsx` | `pages/foo.vue` |
| Dynamic route | `app/p/[id]/page.tsx` | `pages/p/[id].vue` |
| Catch-all | `app/[...slug]/page.tsx` | `pages/[...slug].vue` |
| Group route | `app/(marketing)/...` | `pages/(marketing)/...` |
| Link | `<Link>` | `<NuxtLink>` |
| Programmatic nav | `useRouter().push()` | `useRouter().push()` (same name!) |
| Read params | `useParams()` / `useSearchParams()` | `useRoute().params` / `useRoute().query` |
| Metadata | `export const metadata` | `useHead({ title: ... })` |
| Server route | `app/api/foo/route.ts` (`GET`) | `server/api/foo.get.ts` |
| Read req body | `await req.json()` | `await readBody(event)` |
| Read query | `new URL(req.url).searchParams` | `getQuery(event)` |
| Throw 404 | `throw new Response(null, { status: 404 })` | `throw createError({ statusCode: 404 })` |
| Middleware | `middleware.ts` (one global) | `middleware/*.ts` (per-route, opt-in) |
| Env | `process.env.X` | `useRuntimeConfig().x` |
| Public env | `NEXT_PUBLIC_X` | `runtimeConfig.public.x` |
| Data fetch (RSC) | `await fetch(...)` in async component | `await useFetch(...)` in `<script setup>` |
| Client mutation | `fetch(...)` | `$fetch(...)` |
| Hooks | `useState`, `useMemo`, `useEffect` | `ref()`, `computed()`, `watch()` / `watchEffect()` |
| State mgmt | Zustand / Redux | Pinia |
| Provider wiring | `app/providers.tsx` | `plugins/*.ts` |
| Image | `<Image>` (next/image) | `<NuxtImg>` (requires `@nuxt/image`) |
| i18n | `next-intl` | `@nuxtjs/i18n` |

---

## 4. The five Vue concepts you must know

You'll be lost without these. They're all tiny:

### 4.1 `<script setup>`
The body runs **once per component instance**, on mount. Anything declared at the top level is exposed to the template automatically. There is no `return` statement.

```vue
<script setup>
const count = ref(0)        // available in template as `count`
function inc() { count.value++ }
</script>
<template>
  <button @click="inc">{{ count }}</button>
</template>
```

### 4.2 `ref()` and `.value`
`ref()` wraps a value to make it reactive. In **JS**, read/write via `.value`. In **templates**, Vue unwraps automatically — never write `count.value` in a template.

```ts
const name = ref('jane')
name.value = 'john'   // JS
// {{ name }}         // template (no .value)
```

`reactive()` is the same idea but for objects — fields stay reactive without `.value`. Use whichever feels cleaner.

### 4.3 `computed()` and `watch()`
- `computed(() => a.value + b.value)` → React `useMemo`. Cached, returns a ref.
- `watch(source, cb)` → React `useEffect` with explicit deps. Fires when `source` changes.
- `watchEffect(cb)` → like `useEffect` with auto-tracked deps.

### 4.4 Templates: `v-if`, `v-for`, `v-model`, `@event`, `:bind`
- `v-if="cond"` / `v-else` — conditional rendering
- `v-for="x in list" :key="x.id"` — list rendering (key is required)
- `v-model="state"` — two-way binding (input → state and back)
- `@click="fn"` — event listener (shorthand for `v-on:click`)
- `:src="url"` — bind a prop/attr (shorthand for `v-bind:src`)

### 4.5 Slots = React `children`
A component can declare named slots:
```vue
<UCard>
  <template #header>Title here</template>
  Default body content
</UCard>
```
The `#header` template content is injected into the named `<slot name="header" />` inside `UCard`. The unnamed content goes into the default `<slot />`. This is React `children` plus named children.

---

## 5. Key Nuxt-isms

### 5.1 Auto-imports
You almost never `import` Nuxt APIs. Anything in `/components`, `/composables`, `/stores`, plus all Nuxt globals (`useFetch`, `useRoute`, `defineNuxtConfig`, etc) are auto-injected at build time. You can still `import` types though — that's necessary.

If you ever wonder "where does `useFetch` come from?", the answer is "Nuxt added it for you". Run `pnpm nuxt prepare` to refresh types.

### 5.2 `useFetch` vs `$fetch`
| | `useFetch` | `$fetch` |
|---|---|---|
| When | Loading data on a page mount | Mutations, manual fetches |
| SSR? | Yes — runs on server, hydrates on client | Same env you call it from |
| Returns | `{ data, pending, error, refresh }` | The response (Promise) |
| Reactive | Re-runs when reactive `query`/`key` changes | One-shot |
| Cached | Yes (per `key`) | No |

Rule of thumb: **use `useFetch` for GETs in `<script setup>`; use `$fetch` for everything else** (POSTs, click handlers, store actions).

### 5.3 `import.meta.client` / `import.meta.server`
Nuxt's safe replacement for `typeof window !== 'undefined'`. Use it to gate browser-only code (like `localStorage`).

### 5.4 File suffixes for plugins/components
- `foo.client.ts` → only runs in the browser
- `foo.server.ts` → only runs on the server
- `foo.global.ts` (middleware) → runs on every route, no opt-in needed

---

## 6. The auth flow, end to end

This is the bit you asked about specifically. Trace it in this order:

1. **`pages/auth/login.vue`** – User submits the form. Calls `auth.login(email, password)`.
2. **`stores/auth.ts` → `login()`** – POSTs to `/api/auth/login` via `$fetch`.
3. **`server/api/auth/login.post.ts`** – Validates body with Zod, looks up the user in `fakeDb`, signs a token via `server/utils/token.ts`, returns `{ token, user }`.
4. **`stores/auth.ts` → `setSession()`** – Stores token in Pinia state **and** writes it to `localStorage` under `nll.token`. Sets `user` so `isAuthenticated` flips true.
5. **Login page redirects** to `?redirect=...` (set by middleware) or `/dashboard`.
6. **On the next page load** (or hard refresh), `plugins/auth.client.ts` runs `auth.fetchMe()` which:
   - Reads the token from `localStorage`.
   - Calls `/api/me` with `Authorization: Bearer <token>`.
   - On success → populates `user`. On failure → wipes session (token expired/tampered).
7. **Visiting `/dashboard`** triggers `middleware/auth.ts`:
   - On the server, it skips (we can't read `localStorage` there).
   - On the client, it checks `isAuthenticated`. If false → `navigateTo('/auth/login?redirect=...')`.
8. **`composables/useApi.ts`** is the helper for any future authed call — it uses `$fetch.create()` to inject the `Authorization` header automatically and auto-logout on 401.

> ⚠️ **localStorage vs cookies:** storing tokens in `localStorage` is the easiest pattern and what you asked for, but it's vulnerable to XSS. For production, use **HTTP-only cookies** set by the server (`setCookie(event, ...)` in Nitro) and read them server-side via `getCookie(event, ...)`. The flow stays nearly identical — only the storage primitive changes.

---

## 7. How to add a new protected page

Three steps:

1. Create `pages/your-page.vue`.
2. Add this to its `<script setup>`:
   ```ts
   definePageMeta({ middleware: ['auth'] })
   ```
3. (Optional) Add `ssr: false` for that path under `nitro.routeRules` in `nuxt.config.ts` if you don't want server-rendered shells flashing for unauth'd users.

That's it. The middleware redirects unauth'd users automatically.

---

## 8. How to add a new server API route

1. Create `server/api/<name>.<method>.ts` — e.g. `server/api/orders/index.post.ts` becomes `POST /api/orders`.
2. Inside, call `defineEventHandler(async (event) => { ... })`.
3. Use the helpers: `getQuery(event)`, `readBody(event)`, `getHeader(event, ...)`, `getRouterParam(event, 'id')`, `createError(...)`, `setCookie(event, ...)`.
4. (Optional) Wrap input parsing with `readValidatedBody(event, schema.safeParse)` if you're using Zod.

You don't need to register the file anywhere — Nitro picks it up by filename.

---

## 9. Deploying to Cloudflare Pages

```bash
pnpm deploy
```

This runs `nuxt build` with the `cloudflare_pages` Nitro preset and uploads `dist/`. The first time you run it, Wrangler will prompt you to log in and pick a project name.

Set your `JWT_SECRET` in the Cloudflare dashboard under **Pages → your project → Settings → Environment Variables**. Nuxt will pick it up via `runtimeConfig`.

---

## 10. What to try next (exercises)

- Add an `@nuxt/image` setup so product images go through Cloudflare's image resizer.
- Switch the auth token storage from `localStorage` to an HTTP-only cookie (`setCookie` in `login.post.ts`, `getCookie` in `me.get.ts`). Notice how the middleware can now run on the server too.
- Add a `pages/products/category/[slug].vue` route that pre-filters by category — practice with route params and fetch keys.
- Replace the in-memory `fakeDb` with Cloudflare D1 — the schema lives in SQL, the queries via `event.context.cloudflare.env.DB.prepare(...)`.
- Add a global error page at `error.vue` (top-level, sibling of `app.vue`) — Nuxt's equivalent of Next.js `error.tsx`.
