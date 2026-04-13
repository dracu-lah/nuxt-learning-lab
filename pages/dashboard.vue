<!--
  /dashboard — Protected page.

  KEY BIT: `definePageMeta({ middleware: ['auth'] })` is what makes this
  page protected. The `auth` middleware file under /middleware runs before
  the page renders and bounces you to /auth/login if there's no session.

  Inside the component we use `useApi()` — our fetch wrapper that attaches
  the Bearer token — to hit a protected endpoint and render the response.
-->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ $t('dashboard.title') }}</h1>
      <p class="text-sm text-gray-500">{{ $t('dashboard.subtitle') }}</p>
    </div>

    <UCard>
      <div class="space-y-2">
        <p class="text-sm text-gray-500">
          {{ $t('auth.signedInAs', { email: auth.user?.email }) }}
        </p>
        <pre class="text-xs bg-gray-100 dark:bg-gray-900 rounded-md p-3 overflow-auto">{{ me }}</pre>
      </div>
    </UCard>

    <UButton color="gray" variant="soft" icon="i-lucide-log-out" @click="handleLogout">
      {{ $t('nav.logout') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// This is the line that makes the page protected.
definePageMeta({ middleware: ['auth'] })

useHead({ title: 'Dashboard · Nuxt Learning Lab' })

const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()
const api = useApi()

// Fetch /api/me with the token attached. We do this even though `auth.user`
// is already populated, just to demonstrate the authed-fetch pattern.
const me = ref<unknown>(null)
onMounted(async () => {
  try {
    me.value = await api<unknown>('/api/me')
  } catch {
    me.value = { error: 'failed to load' }
  }
})

async function handleLogout() {
  auth.logout()
  await router.push(localePath('/'))
}
</script>
