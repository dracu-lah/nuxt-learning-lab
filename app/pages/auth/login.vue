<!--
  /auth/login — Email + password sign-in form.

  Flow:
    1. User submits form.
    2. `authStore.login()` POSTs to /api/auth/login.
    3. On success, token is stored in Pinia state AND localStorage.
    4. We redirect to `?redirect=...` (set by the auth middleware) or `/dashboard`.
-->
<template>
  <div class="max-w-md mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">{{ $t('auth.signIn') }}</h1>
        <p class="text-sm text-gray-500">{{ $t('auth.hint') }}</p>
      </template>

      <!--
        <UForm> binds validation + submit. `state` is the reactive form
        model; `schema` is a Zod schema Nuxt UI will run on blur/submit.
      -->
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="$t('auth.email')" name="email">
          <UInput v-model="state.email" type="email" autocomplete="email" class="w-full" />
        </UFormField>

        <UFormField :label="$t('auth.password')" name="password">
          <UInput v-model="state.password" type="password" autocomplete="current-password" class="w-full" />
        </UFormField>

        <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>

        <UButton type="submit" :loading="auth.loading" block>
          {{ $t('auth.signIn') }}
        </UButton>
      </UForm>

      <template #footer>
        <NuxtLink :to="localePath('/auth/register')" class="text-sm text-primary">
          {{ $t('auth.noAccount') }}
        </NuxtLink>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'

useHead({ title: 'Sign in · Nuxt Learning Lab' })

// `definePageMeta` attaches per-page options (layout, middleware, etc).
// Both auth pages use the dedicated `auth` layout (sidebar + brand panel).
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

// `reactive()` returns a proxy — mutate fields directly (like Zustand sets).
// `ref()` wraps a single value. Both are reactive; pick whichever fits.
const state = reactive({ email: 'demo@nuxt.dev', password: 'password' })

const schema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Required')
})

async function onSubmit() {
  try {
    await auth.login(state.email, state.password)
    // `route.query.redirect` was set by the auth middleware when it
    // bounced you here from a protected page — respect it on success.
    const target = (route.query.redirect as string) || localePath('/dashboard')
    await router.push(target)
  } catch {
    // Error is already surfaced via `auth.error` in the template.
  }
}
</script>
