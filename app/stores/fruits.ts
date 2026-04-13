// Pinia store for the fruits CRUD demo.
//
// This store is the source of truth for the protected /fruits page, the
// create dialog, and the /fruits/[id]/edit page. State is persisted to
// localStorage so a refresh keeps your edits — same pattern as the cart
// and auth stores.
//
// The store is intentionally chunky (filter-by-store helpers, sample seed
// data) so the list page stays declarative and the form components stay
// dumb.

import { defineStore } from 'pinia'

export type FruitCategory = 'citrus' | 'berry' | 'tropical' | 'stone' | 'melon'

export type Fruit = {
  id: string
  name: string
  category: FruitCategory
  price: number
  qty: number
  organic: boolean
  harvestedOn: string  // ISO date `YYYY-MM-DD`
  notes?: string
}

const STORAGE_KEY = 'nll.fruits'

// First-load seed so the page isn't empty when a user opens the project
// for the first time. Wiped the moment the user mutates anything.
const SEED: Fruit[] = [
  { id: 'f1', name: 'Valencia Orange',  category: 'citrus',   price:  2.5, qty: 40, organic: true,  harvestedOn: '2026-03-12', notes: 'Peak season' },
  { id: 'f2', name: 'Strawberry',       category: 'berry',    price:  4.0, qty: 12, organic: true,  harvestedOn: '2026-04-02' },
  { id: 'f3', name: 'Mango Alphonso',   category: 'tropical', price:  6.5, qty:  8, organic: false, harvestedOn: '2026-03-28', notes: 'Imported' },
  { id: 'f4', name: 'Bing Cherry',      category: 'stone',    price:  9.0, qty: 18, organic: true,  harvestedOn: '2026-04-09' },
  { id: 'f5', name: 'Watermelon',       category: 'melon',    price:  3.5, qty:  6, organic: false, harvestedOn: '2026-04-05' },
  { id: 'f6', name: 'Blueberry',        category: 'berry',    price:  5.5, qty: 22, organic: true,  harvestedOn: '2026-04-10' },
  { id: 'f7', name: 'Pink Lady Apple',  category: 'stone',    price:  3.0, qty: 30, organic: false, harvestedOn: '2026-02-15' },
  { id: 'f8', name: 'Pomelo',           category: 'citrus',   price:  4.5, qty:  9, organic: true,  harvestedOn: '2026-03-01' }
]

export const useFruitsStore = defineStore('fruits', () => {
  // --- state -----------------------------------------------------------
  const items = ref<Fruit[]>([...SEED])
  const hydrated = ref(false)

  // --- getters ---------------------------------------------------------
  const count = computed(() => items.value.length)

  // --- helpers ---------------------------------------------------------
  function persist() {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function hydrate() {
    if (!import.meta.client || hydrated.value) return
    hydrated.value = true
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Fruit[]
      if (Array.isArray(parsed)) items.value = parsed
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function getById(id: string): Fruit | null {
    return items.value.find(f => f.id === id) ?? null
  }

  // --- actions ---------------------------------------------------------
  function create(input: Omit<Fruit, 'id'>): Fruit {
    const fruit: Fruit = {
      id: `f_${Date.now().toString(36)}`,
      ...input
    }
    items.value.push(fruit)
    persist()
    return fruit
  }

  function update(id: string, patch: Omit<Fruit, 'id'>): Fruit | null {
    const idx = items.value.findIndex(f => f.id === id)
    if (idx === -1) return null
    items.value[idx] = { id, ...patch }
    persist()
    return items.value[idx]
  }

  function remove(id: string) {
    items.value = items.value.filter(f => f.id !== id)
    persist()
  }

  return {
    items, count, hydrated,
    getById, create, update, remove, hydrate
  }
})
