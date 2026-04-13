// POST /api/auth/login
// Body: { email, password }  →  { token, user }
//
// NEXT.JS ANALOGY
// ---------------
// Equivalent to `app/api/auth/login/route.ts` with an exported `POST`.
// Here we:
//   1. Parse and validate the JSON body with Zod (via `readValidatedBody`).
//   2. Look up the user in our fake DB.
//   3. Sign a token using the server-only `jwtSecret` from runtimeConfig.
//   4. Return token + a safe user projection (never leak the password).

import { z } from 'zod'
import { findUserByEmail } from '~~/server/utils/fakeDb'
import { signToken } from '~~/server/utils/token'

const BodySchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  // `readValidatedBody` parses JSON and validates with your schema in one step.
  const body = await readValidatedBody(event, BodySchema.safeParse)
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: body.error.flatten() })
  }

  const user = findUserByEmail(body.data.email)
  if (!user || user.password !== body.data.password) {
    // Generic error message — don't leak which part was wrong.
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const { jwtSecret } = useRuntimeConfig()
  const token = await signToken({ sub: user.id, email: user.email }, jwtSecret)

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name }
  }
})
