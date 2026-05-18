import { createClient } from "@libsql/client"
import type { Client } from "@libsql/client"

let _db: Client | null = null

function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL
    const token = process.env.TURSO_AUTH_TOKEN
    if (!url) {
      throw new Error("TURSO_DATABASE_URL environment variable is not set")
    }
    if (!token || token === "your-auth-token") {
      throw new Error(
        "TURSO_AUTH_TOKEN is missing or still a placeholder. Generate a real token at https://turso.tech/app"
      )
    }
    _db = createClient({ url, authToken: token })
  }
  return _db
}

let _initialized = false

export async function ensureDb(): Promise<Client> {
  const db = getDb()
  if (!_initialized) {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS looks (
          id          TEXT PRIMARY KEY,
          title       TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          images      TEXT NOT NULL DEFAULT '[]',
          coverIndex  INTEGER NOT NULL DEFAULT 0,
          createdAt   TEXT NOT NULL
        )
      `)
      _initialized = true
    } catch (cause) {
      throw new Error(
        `Failed to initialize Turso database. Check that your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are correct.`, { cause }
      )
    }
  }
  return db
}
