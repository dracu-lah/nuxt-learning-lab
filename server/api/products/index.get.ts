// GET /api/products?q=...&category=...&sort=...&limit=...&offset=...
//
// NEXT.JS ANALOGY
// ---------------
// This file is Nitro's equivalent of `app/api/products/route.ts` with a
// `GET` export. The filename encodes both the URL and the HTTP method:
//
//    server/api/products/index.get.ts  → GET /api/products
//    server/api/products/[id].get.ts   → GET /api/products/:id
//    server/api/auth/login.post.ts     → POST /api/auth/login
//
// Inside, `defineEventHandler` is the handler wrapper (like exporting
// `async function GET(req: Request)` in Next.js). `getQuery(event)` reads
// URL search params — the Nitro version of `new URL(req.url).searchParams`.
//
// We use Zod to validate query input. Same idea as validating `searchParams`
// in a Next.js route handler, and it gives the client typed errors.

import { z } from 'zod'
import { findProducts } from '~~/server/utils/fakeDb'

// Zod coerces query strings (which are always strings) into numbers/enums.
const QuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.enum(['electronics', 'apparel', 'home', 'beauty']).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(['price-asc', 'price-desc', 'rating']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  offset: z.coerce.number().int().min(0).default(0)
})

export default defineEventHandler(async (event) => {
  // `getQuery` returns a plain object of query params. Zod validates it.
  const parsed = QuerySchema.safeParse(getQuery(event))

  if (!parsed.success) {
    // `createError` is Nitro's version of `throw new Response(..., { status })`.
    // Client-side `useFetch` will surface this as `error.value`.
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query',
      data: parsed.error.flatten()
    })
  }

  return findProducts(parsed.data)
})
