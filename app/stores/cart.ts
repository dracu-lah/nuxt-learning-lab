// Pinia store for the shopping cart.
//
// NEXT.JS / REACT ANALOGY
// -----------------------
// Same as `useAuthStore` — Pinia is Vue's Zustand. We expose a composition-API
// style store: state via `ref()`, derived values via `computed()`, mutations
// as plain functions. Persistence to localStorage mirrors the auth store so
// the cart survives page refreshes (browser-only).

import { defineStore } from 'pinia'
import type { Product } from '~~/server/utils/fakeDb'

export type CartItem = {
  id: number
  title: string
  price: number
  image: string
  qty: number
}

const STORAGE_KEY = 'nll.cart'

export const useCartStore = defineStore('cart', () => {
  // --- state ------------------------------------------------------------
  const items = ref<CartItem[]>([])

  // --- getters ----------------------------------------------------------
  const count = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.qty, 0)
  )
  const isEmpty = computed(() => items.value.length === 0)

  // --- helpers ----------------------------------------------------------
  function persist() {
    if (!import.meta.client) return
    if (items.value.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Called once on the client to rehydrate the cart from localStorage.
  // Wired up in /plugins/cart.client.ts.
  function hydrate() {
    if (!import.meta.client) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CartItem[]
      if (Array.isArray(parsed)) items.value = parsed
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // --- actions ----------------------------------------------------------
  // `add()` accepts a `Product` (the full server shape) and snapshots only
  // the fields we want to display. Decoupling cart items from the live
  // catalog means a price update later won't retroactively rewrite history.
  function add(product: Product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        qty
      })
    }
    persist()
  }

  function setQty(id: number, qty: number) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    if (qty <= 0) {
      remove(id)
      return
    }
    item.qty = qty
    persist()
  }

  function remove(id: number) {
    items.value = items.value.filter(i => i.id !== id)
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  return {
    items, count, subtotal, isEmpty,
    add, setQty, remove, clear, hydrate
  }
})
