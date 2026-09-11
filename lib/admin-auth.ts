import { cookies } from "next/headers"
import crypto from "crypto"

export const ADMIN_COOKIE_NAME = "techlynk_admin_session"
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

/** Derives a signing key from ADMIN_PASSWORD so no second secret needs configuring. */
function sessionSecret(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return crypto.createHash("sha256").update(password).digest()
}

/** Constant-time compare against the configured admin password. */
export function verifyAdminPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(password)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/** Signed `<expiry>.<hmac>` token — no server-side session store needed. */
export function createAdminSessionToken(): string | null {
  const secret = sessionSecret()
  if (!secret) return null
  const expiry = Date.now() + ADMIN_SESSION_TTL_MS
  const sig = crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex")
  return `${expiry}.${sig}`
}

export function isValidAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const secret = sessionSecret()
  if (!secret) return false

  const [expiryStr, sig] = token.split(".")
  if (!expiryStr || !sig) return false

  const expected = crypto.createHmac("sha256", secret).update(expiryStr).digest("hex")
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false
  }

  const expiry = Number(expiryStr)
  return Number.isFinite(expiry) && Date.now() < expiry
}

/** For route handlers and server components: is the current request authenticated as admin? */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies()
  return isValidAdminSessionToken(store.get(ADMIN_COOKIE_NAME)?.value)
}
