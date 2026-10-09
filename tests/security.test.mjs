import test from "node:test"
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { createSessionToken, verifySessionToken } from "../lib/auth.ts"
import { detectImageType, MAX_IMAGE_BYTES } from "../lib/images.ts"

process.env.AUTH_SECRET = "test-secret-with-at-least-32-characters"
function signed(payload) {
  const json = JSON.stringify(payload)
  return `${Buffer.from(json).toString("base64url")}.${createHmac("sha256", process.env.AUTH_SECRET).update(json).digest("hex")}`
}
test("a valid studio session is accepted", () =>
  assert.equal(verifySessionToken(createSessionToken()), true))
test("tampered and malformed sessions are rejected", () => {
  assert.equal(verifySessionToken(`${createSessionToken()}00`), false)
  assert.equal(verifySessionToken("invalid"), false)
  assert.equal(verifySessionToken(`${createSessionToken()}zz`), false)
})
test("expired, future, and missing timestamps are rejected", () => {
  for (const timestamp of [
    Date.now() - 86400001,
    Date.now() + 60000,
    undefined,
  ]) {
    assert.equal(
      verifySessionToken(signed({ authenticated: true, timestamp })),
      false
    )
  }
})
test("production sessions require a strong secret", () => {
  const previous = process.env.NODE_ENV
  process.env.NODE_ENV = "production"
  const secret = process.env.AUTH_SECRET
  process.env.AUTH_SECRET = "short"
  assert.throws(() => createSessionToken(), /AUTH_SECRET/)
  assert.equal(
    verifySessionToken(signed({ authenticated: true, timestamp: Date.now() })),
    false
  )
  process.env.AUTH_SECRET = secret
  if (previous === undefined) delete process.env.NODE_ENV
  else process.env.NODE_ENV = previous
})
test("image signatures distinguish permitted formats from HTML and SVG", () => {
  assert.equal(detectImageType(Uint8Array.from([255, 216, 255])), "image/jpeg")
  assert.equal(
    detectImageType(Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/png"
  )
  assert.equal(detectImageType(Buffer.from("GIF89a")), "image/gif")
  assert.equal(detectImageType(Buffer.from("RIFF0000WEBP")), "image/webp")
  assert.equal(detectImageType(Buffer.from("<svg></svg>")), null)
  assert.equal(detectImageType(Buffer.from("<html>")), null)
  assert.equal(detectImageType(new Uint8Array()), null)
  assert.equal(MAX_IMAGE_BYTES, 4194304)
})
