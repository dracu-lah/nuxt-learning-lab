<!--
  /auth/register — Sign-up form. Mirrors login.vue almost exactly; the
  only difference is the extra `name` field and the schema minimums.
-->
<template>
  <div class="max-w-md mx-auto">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">{{ $t('auth.signUp') }}</h1>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" autocomplete="name" />
        </UFormField>

        <UFormField :label="$t('auth.email')" name="email">
          <UInput v-model="state.email" type="email" autocomplete="email" />
        </UFormField>

        <UFormField :label="$t('auth.password')" name="password">
          <UInput v-model="state.password" type="password" autocomplete="new-password" />
        </UFormField>

        <p v-if="auth.error" class="text-sm text-red-500">{{ auth.error }}</p>

        <UButton type="submit" :loading="auth.loading" block>
          {{ $t('auth.signUp') }}
        </UButton>
      </UForm>

      <template #footer>
        <NuxtLink :to="localePath('/auth/login')" class="text-sm text-primary">
          {{ $t('auth.haveAccount') }}
        </NuxtLink>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'

useHead({ title: 'Sign up · Nuxt Learning Lab' })

const auth = useAuthStore()
const router = useRouter()
const localePath = useLocalePath()

const state = reactive({ name: '', email: '', password: '' })

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6, 'At least 6 characters')
})

async function onSubmit() {
  try {
    await auth.register(state.email, state.password, state.name)
    await router.push(localePath('/dashboard'))
  } catch {
    // error visible via auth.error
  }
}
</script>
