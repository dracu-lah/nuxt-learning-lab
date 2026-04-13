// Client-only plugin that rehydrates the cart from localStorage on app
// boot. Mirrors plugins/auth.client.ts.
//
// Without this, the Pinia store starts empty on every page load and the
// user's cart appears to "vanish" on refresh.

import { useCartStore } from '~/stores/cart'

export default defineNuxtPlugin(() => {
  const cart = useCartStore()
  cart.hydrate()
})
