// Tiny in-memory "database" for the learning lab.
//
// NEXT.JS ANALOGY
// ---------------
// Think of /server/utils as a shared module folder used by your API
// handlers — like a `lib/` folder you'd import from `app/api/*/route.ts`.
// Anything exported from /server/utils is AUTO-IMPORTED inside /server,
// so handlers can just call `fakeDb.findProducts(...)` with no import.
//
// Real apps would use Cloudflare D1, KV, or a hosted Postgres. This module
// exists only to keep the example self-contained and give you realistic
// data shapes (with images + categories) for the search-params demo.

export type Product = {
  id: number
  title: string
  description: string
  price: number
  category: 'electronics' | 'apparel' | 'home' | 'beauty'
  image: string
  rating: number
}

// Using picsum.photos for deterministic placeholder images — no API key.
const img = (seed: number) => `https://picsum.photos/seed/nuxtlab${seed}/600/400`

const PRODUCTS: Product[] = [
  { id: 1,  title: 'Matte Black Headphones', description: 'Over-ear, 40h battery, ANC.',           price: 189, category: 'electronics', image: img(1),  rating: 4.6 },
  { id: 2,  title: 'Linen Oversized Shirt',  description: 'Breathable summer-weight linen.',       price:  64, category: 'apparel',     image: img(2),  rating: 4.3 },
  { id: 3,  title: 'Ceramic Pour-Over Kit',  description: '02-size dripper + server, slate gray.', price:  42, category: 'home',        image: img(3),  rating: 4.8 },
  { id: 4,  title: 'Hydrating Face Serum',   description: 'Hyaluronic + niacinamide, 30ml.',       price:  28, category: 'beauty',      image: img(4),  rating: 4.2 },
  { id: 5,  title: 'Mechanical Keyboard',    description: 'Low-profile 75%, hot-swap.',            price: 159, category: 'electronics', image: img(5),  rating: 4.7 },
  { id: 6,  title: 'Merino Crew Socks (3pk)',description: 'Mid-weight, mid-calf.',                 price:  32, category: 'apparel',     image: img(6),  rating: 4.5 },
  { id: 7,  title: 'Cast-Iron Skillet 10"',  description: 'Pre-seasoned, made in USA.',            price:  55, category: 'home',        image: img(7),  rating: 4.9 },
  { id: 8,  title: 'Lip Balm Trio',          description: 'Unscented, beeswax-based.',             price:  14, category: 'beauty',      image: img(8),  rating: 4.1 },
  { id: 9,  title: 'Mirrorless Camera',      description: '24MP APS-C, 4k60.',                     price: 899, category: 'electronics', image: img(9),  rating: 4.8 },
  { id: 10, title: 'Selvedge Denim Jeans',   description: 'Raw 14oz, straight cut.',               price: 148, category: 'apparel',     image: img(10), rating: 4.4 },
  { id: 11, title: 'Brass Desk Lamp',        description: 'Warm dimmable LED.',                    price:  88, category: 'home',        image: img(11), rating: 4.5 },
  { id: 12, title: 'Refillable Razor',       description: 'Chrome handle, 5-pack blades.',         price:  36, category: 'beauty',      image: img(12), rating: 4.6 }
]

export type FindProductsInput = {
  q?: string
  category?: Product['category']
  minPrice?: number
  maxPrice?: number
  sort?: 'price-asc' | 'price-desc' | 'rating'
  limit?: number
  offset?: number
}

export function findProducts(input: FindProductsInput) {
  let list = [...PRODUCTS]

  if (input.q) {
    const needle = input.q.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle)
    )
  }
  if (input.category) list = list.filter(p => p.category === input.category)
  if (input.minPrice != null) list = list.filter(p => p.price >= input.minPrice!)
  if (input.maxPrice != null) list = list.filter(p => p.price <= input.maxPrice!)

  if (input.sort === 'price-asc')  list.sort((a, b) => a.price - b.price)
  if (input.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  if (input.sort === 'rating')     list.sort((a, b) => b.rating - a.rating)

  const total = list.length
  const offset = input.offset ?? 0
  const limit = input.limit ?? 20
  const items = list.slice(offset, offset + limit)

  return { items, total, offset, limit }
}

export function getProductById(id: number): Product | null {
  return PRODUCTS.find(p => p.id === id) ?? null
}

// --- Fake users (for the auth demo) -------------------------------------
// In a real app: hashed passwords in a DB. Here: a plain array. A pre-seeded
// demo account lets you try login without registering first.
type User = { id: string; email: string; password: string; name: string }

const USERS: User[] = [
  { id: 'u_demo', email: 'demo@nuxt.dev', password: 'password', name: 'Demo User' }
]

export function findUserByEmail(email: string): User | null {
  return USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function createUser(email: string, password: string, name: string): User {
  const user: User = { id: `u_${Date.now()}`, email, password, name }
  USERS.push(user)
  return user
}

export function getUserById(id: string): User | null {
  return USERS.find(u => u.id === id) ?? null
}
