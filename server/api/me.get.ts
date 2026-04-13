// GET /api/me
//
// Protected server endpoint. Reads the Authorization header, verifies the
// token, and returns the current user. If no valid token → 401.
//
// Pattern to remember: client stores token in localStorage, then attaches
// it to outgoing requests via an `Authorization: Bearer <token>` header.
// This file is the server-side half of that flow.

import { verifyToken } from '~~/server/utils/token'
import { getUserById } from '~~/server/utils/fakeDb'

export default defineEventHandler(async (event) => {
  // `getHeader` is Nitro's header reader. Cookies work similarly via `getCookie`.
  const authz = getHeader(event, 'authorization') ?? ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing token' })
  }

  const { jwtSecret } = useRuntimeConfig()
  const payload = await verifyToken(token, jwtSecret)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }

  const user = getUserById(payload.sub)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return { id: user.id, email: user.email, name: user.name }
})
