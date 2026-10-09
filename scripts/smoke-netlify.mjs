import assert from "node:assert/strict"
const base = process.env.SMOKE_URL || "http://127.0.0.1:8888"
const password = process.env.STUDIO_PASSWORD
if (!password) throw new Error("Set STUDIO_PASSWORD locally")
let ready = false
for (let attempt = 0; attempt < 50; attempt++) {
  try {
    const response = await fetch(`${base}/api/looks`, {
      signal: AbortSignal.timeout(1000),
    })
    if (response.ok) {
      ready = true
      break
    }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
assert.ok(ready, "Netlify Dev did not become ready")
let response = await fetch(`${base}/api/uploads`, { method: "POST" })
assert.equal(response.status, 401)
response = await fetch(`${base}/api/auth`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
})
assert.equal(response.status, 200)
const cookie = response.headers.get("set-cookie").split(";")[0]
const bad = new FormData()
bad.set("file", new Blob(["<svg></svg>"], { type: "image/svg+xml" }), "bad.svg")
response = await fetch(`${base}/api/uploads`, {
  method: "POST",
  headers: { cookie },
  body: bad,
})
assert.equal(response.status, 400)
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64"
)
const form = new FormData()
form.set("file", new Blob([png], { type: "image/png" }), "test.png")
response = await fetch(`${base}/api/uploads`, {
  method: "POST",
  headers: { cookie },
  body: form,
})
const image = await response.json()
assert.equal(response.status, 201, JSON.stringify(image))
response = await fetch(base + image.url)
assert.equal(response.status, 200)
assert.equal(response.headers.get("content-type"), "image/png")
assert.deepEqual(Buffer.from(await response.arrayBuffer()), png)
response = await fetch(`${base}/api/looks`, {
  method: "POST",
  headers: { cookie, "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Netlify smoke test",
    description: "Temporary test",
    images: [image.url],
    coverIndex: 0,
  }),
})
assert.equal(response.status, 201)
const created = await response.json()
try {
  response = await fetch(`${base}/api/looks`)
  assert.ok((await response.json()).some((look) => look.id === created.id))
  response = await fetch(`${base}/api/looks/${created.id}`, {
    method: "PUT",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Updated test", id: "cannot-change-id" }),
  })
  assert.equal(response.status, 200)
  const updated = await response.json()
  assert.equal(updated.title, "Updated test")
  assert.equal(updated.id, created.id)
} finally {
  response = await fetch(`${base}/api/looks/${created.id}`, {
    method: "DELETE",
    headers: { cookie },
  })
  assert.equal(response.status, 200)
}
response = await fetch(`${base}/api/looks`)
assert.ok(!(await response.json()).some((look) => look.id === created.id))
console.log(
  "Passed: login, unauthorized upload, SVG rejection, image byte round trip, create/read/update/delete"
)
