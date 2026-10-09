import crypto from "crypto"

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (
    process.env.NODE_ENV === "production" &&
    (!secret || secret.length < 32)
  ) {
    throw new Error("Set AUTH_SECRET to at least 32 random characters")
  }
  return secret || "dev-fallback-secret"
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ authenticated: true, timestamp: Date.now() })
  const hmac = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex")
  const encoded = Buffer.from(payload).toString("base64url")
  return `${encoded}.${hmac}`
}

export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return false
    const [encodedPayload, hmac] = parts
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString()
    const payload = JSON.parse(payloadStr)

    const expectedHmac = crypto
      .createHmac("sha256", getSecret())
      .update(payloadStr)
      .digest("hex")
    if (!/^[a-f0-9]{64}$/.test(hmac)) return false
    const signature = Buffer.from(hmac, "hex")
    const expected = Buffer.from(expectedHmac, "hex")
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(signature, expected)
    )
      return false

    const maxAge = 24 * 60 * 60 * 1000
    const age = Date.now() - payload.timestamp
    if (!Number.isFinite(payload.timestamp) || age < 0 || age > maxAge)
      return false

    return payload.authenticated === true
  } catch {
    return false
  }
}
