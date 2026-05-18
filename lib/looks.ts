import { ensureDb } from "@/lib/db"
import type { Look } from "@/lib/types"

function rowToLook(row: Record<string, unknown>): Look {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    images: JSON.parse(row.images as string) as string[],
    coverIndex: row.coverIndex as number,
    createdAt: row.createdAt as string,
  }
}

export async function getLooks(): Promise<Look[]> {
  const db = await ensureDb()
  const result = await db.execute("SELECT * FROM looks ORDER BY createdAt DESC")
  return result.rows.map(rowToLook)
}

export async function getLook(id: string): Promise<Look | null> {
  const db = await ensureDb()
  const result = await db.execute({
    sql: "SELECT * FROM looks WHERE id = ?",
    args: [id],
  })
  if (result.rows.length === 0) return null
  return rowToLook(result.rows[0])
}

export async function createLook(
  data: Omit<Look, "id" | "createdAt">
): Promise<Look> {
  const db = await ensureDb()
  const look: Look = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.execute({
    sql: "INSERT INTO looks (id, title, description, images, coverIndex, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      look.id,
      look.title,
      look.description,
      JSON.stringify(look.images),
      look.coverIndex,
      look.createdAt,
    ],
  })
  return look
}

export async function updateLook(
  id: string,
  data: Partial<Omit<Look, "id" | "createdAt">>
): Promise<Look | null> {
  const existing = await getLook(id)
  if (!existing) return null

  const updated: Look = { ...existing, ...data }
  const db = await ensureDb()
  await db.execute({
    sql: "UPDATE looks SET title = ?, description = ?, images = ?, coverIndex = ? WHERE id = ?",
    args: [
      updated.title,
      updated.description,
      JSON.stringify(updated.images),
      updated.coverIndex,
      id,
    ],
  })
  return updated
}

export async function deleteLook(id: string): Promise<boolean> {
  const db = await ensureDb()
  const result = await db.execute({
    sql: "DELETE FROM looks WHERE id = ?",
    args: [id],
  })
  return result.rowsAffected > 0
}
