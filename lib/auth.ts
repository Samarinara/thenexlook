import crypto from "crypto"

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-fallback-secret"
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
    if (hmac !== expectedHmac) return false

    const maxAge = 24 * 60 * 60 * 1000
    if (Date.now() - payload.timestamp > maxAge) return false

    return payload.authenticated === true
  } catch {
    return false
  }
}
