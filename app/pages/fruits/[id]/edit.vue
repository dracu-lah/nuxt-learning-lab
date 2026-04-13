<!--
  /fruits/:id/edit — Protected edit page. Reuses <FruitForm /> with an
  `initial` prop so the same component drives both create (in a dialog)
  and edit (as a full page).

  If the ID is missing from the store, we redirect back to the list so
  there's never a half-rendered "ghost" form.
-->
<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-arrow-left"
      :to="localePath('/fruits')"
    >
      {{ $t('fruits.backToList') }}
    </UButton>

    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ $t('fruits.edit') }}</h1>
      <p class="text-sm text-(--ui-text-muted)">{{ fruit?.name }}</p>
    </div>

    <UCard>
      <FruitForm
        v-if="fruit"
        :initial="fruit"
        :submit-label="$t('fruits.save')"
        @submit="onSave"
        @cancel="cancel"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useFruitsStore } from '~/stores/fruits'

definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const store = useFruitsStore()

const id = computed(() => route.params.id as string)
const fruit = computed(() => store.getById(id.value))

useHead({
  title: () => fruit.value ? `${t('fruits.edit')} · ${fruit.value.name}` : t('fruits.edit')
})

// If the store hasn't hydrated yet, wait one tick before redirecting on
// missing IDs — otherwise the user's first navigation directly to an
// edit URL would bounce them away before localStorage finished loading.
onMounted(() => {
  store.hydrate()
  nextTick(() => {
    if (!fruit.value) router.replace(localePath('/fruits'))
  })
})

function onSave(value: Parameters<typeof store.update>[1]) {
  store.update(id.value, value)
  toast.add({ title: t('fruits.updated'), color: 'success' })
  router.push(localePath('/fruits'))
}

function cancel() {
  router.push(localePath('/fruits'))
}
</script>
