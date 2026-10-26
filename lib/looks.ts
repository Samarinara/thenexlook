import {
  deleteStoredLook,
  getStoredLook,
  listLookKeys,
  setStoredLook,
} from "@/lib/storage"
import type { Look } from "@/lib/types"

export async function getLooks(): Promise<Look[]> {
  const entries = await Promise.all((await listLookKeys()).map(getStoredLook))
  const looks = entries.filter((look): look is Look => look !== null)
  return looks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getLook(id: string): Promise<Look | null> {
  return getStoredLook(id)
}

export async function createLook(
  data: Omit<Look, "id" | "createdAt">
): Promise<Look> {
  const look: Look = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await setStoredLook(look.id, look)
  return look
}

export async function updateLook(
  id: string,
  data: Partial<Omit<Look, "id" | "createdAt">>
): Promise<Look | null> {
  const existing = await getLook(id)
  if (!existing) return null
  // Keep identity and creation date immutable even if supplied by the client.
  const updated: Look = {
    ...existing,
    title: data.title ?? existing.title,
    description: data.description ?? existing.description,
    images: data.images ?? existing.images,
    coverIndex: data.coverIndex ?? existing.coverIndex,
  }
  await setStoredLook(id, updated)
  return updated
}

export async function deleteLook(id: string): Promise<boolean> {
  if (!(await getLook(id))) return false
  await deleteStoredLook(id)
  return true
}
