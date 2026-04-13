<!--
  Reusable fruit form — used by the create dialog AND the /fruits/[id]/edit
  page. By living in /components and accepting an `initial` prop, both
  flows share validation, layout, and the field components.

  This is also the showcase form for the project: it deliberately uses
  every commonly-needed field type from Nuxt UI v4 — text, number,
  textarea, select, switch, native date — wired through <UForm> with
  Zod validation and per-field error rendering via <UFormField>.
-->
<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <div class="grid sm:grid-cols-2 gap-4">
      <UFormField :label="$t('fruits.name')" name="name" required>
        <UInput v-model="state.name" :placeholder="$t('fruits.namePlaceholder')" />
      </UFormField>

      <UFormField :label="$t('fruits.category')" name="category" required>
        <USelectMenu
          v-model="state.category"
          :items="categoryItems"
          value-key="value"
          :placeholder="$t('fruits.category')"
        />
      </UFormField>

      <UFormField :label="$t('fruits.price')" name="price" required>
        <UInput
          v-model.number="state.price"
          type="number"
          :min="0"
          :step="0.5"
          icon="i-lucide-dollar-sign"
        />
      </UFormField>

      <UFormField :label="$t('fruits.qty')" name="qty" required>
        <UInput
          v-model.number="state.qty"
          type="number"
          :min="0"
          icon="i-lucide-package"
        />
      </UFormField>

      <UFormField :label="$t('fruits.harvested')" name="harvestedOn" required>
        <UInput v-model="state.harvestedOn" type="date" icon="i-lucide-calendar" />
      </UFormField>

      <UFormField :label="$t('fruits.organic')" name="organic">
        <USwitch v-model="state.organic" />
      </UFormField>
    </div>

    <UFormField :label="$t('fruits.notes')" name="notes">
      <UTextarea v-model="state.notes" :rows="3" :placeholder="$t('fruits.notesPlaceholder')" />
    </UFormField>

    <div class="flex justify-end gap-2 pt-2">
      <UButton variant="ghost" color="neutral" @click="$emit('cancel')">
        {{ $t('fruits.cancel') }}
      </UButton>
      <UButton type="submit" icon="i-lucide-save">
        {{ submitLabel ?? $t('fruits.save') }}
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { Fruit, FruitCategory } from '~/stores/fruits'

const props = defineProps<{
  initial?: Fruit | null
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [value: Omit<Fruit, 'id'>]
  cancel: []
}>()

const { t } = useI18n()

// `state` is what UForm binds to via :state. Use `reactive()` (not `ref`)
// so individual fields can be v-model'd directly without `.value`.
const state = reactive<Omit<Fruit, 'id'>>({
  name: props.initial?.name ?? '',
  category: props.initial?.category ?? 'berry',
  price: props.initial?.price ?? 0,
  qty: props.initial?.qty ?? 0,
  organic: props.initial?.organic ?? false,
  harvestedOn: props.initial?.harvestedOn ?? new Date().toISOString().slice(0, 10),
  notes: props.initial?.notes ?? ''
})

// One central Zod schema — it validates the create dialog, the edit page,
// and (if we wired it) the API server route. Single source of truth.
const schema = z.object({
  name: z.string().min(1, 'Required').max(60),
  category: z.enum(['citrus', 'berry', 'tropical', 'stone', 'melon']),
  price: z.number().nonnegative('Must be ≥ 0'),
  qty: z.number().int().nonnegative('Must be ≥ 0'),
  organic: z.boolean(),
  harvestedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  notes: z.string().max(280).optional()
})

const categoryItems: { label: string, value: FruitCategory }[] = [
  { label: t('fruits.cat.citrus'),   value: 'citrus' },
  { label: t('fruits.cat.berry'),    value: 'berry' },
  { label: t('fruits.cat.tropical'), value: 'tropical' },
  { label: t('fruits.cat.stone'),    value: 'stone' },
  { label: t('fruits.cat.melon'),    value: 'melon' }
]

function onSubmit() {
  emit('submit', { ...state })
}
</script>
