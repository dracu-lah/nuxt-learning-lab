// GET /api/products/:id
//
// `[id]` in the filename is a dynamic segment, exactly like Next.js
// `app/api/products/[id]/route.ts`. Read it via `getRouterParam`.

import { getProductById } from '~~/server/utils/fakeDb'

export default defineEventHandler((event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product id' })
  }

  const product = getProductById(id)
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})
