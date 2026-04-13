// POST /api/auth/register
// Body: { email, password, name }  →  { token, user }
//
// Same shape as /login. In a real app you'd hash the password with
// bcrypt/argon2 (or Web Crypto PBKDF2 on the edge). We store plaintext
// here to keep the example self-contained.

import { z } from 'zod'
import { createUser, findUserByEmail } from '~~/server/utils/fakeDb'
import { signToken } from '~~/server/utils/token'

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, BodySchema.safeParse)
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: body.error.flatten() })
  }

  if (findUserByEmail(body.data.email)) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const user = createUser(body.data.email, body.data.password, body.data.name)

  const { jwtSecret } = useRuntimeConfig()
  const token = await signToken({ sub: user.id, email: user.email }, jwtSecret)

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name }
  }
})
