// Toy token helpers.
//
// IMPORTANT: this is NOT a real JWT implementation — it's base64(payload).sig
// so you can see the flow end-to-end without pulling a jwt library. In a
// real project use `jose` (edge-compatible) or `@tsndr/cloudflare-worker-jwt`.
//
// The HMAC uses the Web Crypto API, which Cloudflare Workers / Nitro's
// Cloudflare preset support natively.

const encoder = new TextEncoder()

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export type TokenPayload = { sub: string; email: string; exp: number }

export async function signToken(payload: Omit<TokenPayload, 'exp'>, secret: string, ttlSec = 60 * 60 * 24 * 7) {
  const full: TokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSec }
  const body = btoa(JSON.stringify(full))
  const sig = await hmac(secret, body)
  return `${body}.${sig}`
}

export async function verifyToken(token: string, secret: string): Promise<TokenPayload | null> {
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = await hmac(secret, body)
  if (expected !== sig) return null
  try {
    const payload = JSON.parse(atob(body)) as TokenPayload
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
