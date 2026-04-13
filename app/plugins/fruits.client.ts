// Client-only plugin to rehydrate the fruits store from localStorage on
// app boot. Same pattern as cart.client.ts and auth.client.ts.

import { useFruitsStore } from '~/stores/fruits'

export default defineNuxtPlugin(() => {
  const fruits = useFruitsStore()
  fruits.hydrate()
})
