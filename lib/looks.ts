import fs from "fs"
import path from "path"
import type { Look } from "@/lib/types"

const DATA_FILE = path.join(process.cwd(), "data", "looks.json")

function readLooks(): Look[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(raw) as Look[]
  } catch {
    return []
  }
}

function writeLooks(looks: Look[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(looks, null, 2), "utf-8")
}

export function getLooks(): Look[] {
  return readLooks()
}

export function getLook(id: string): Look | undefined {
  return readLooks().find((l) => l.id === id)
}

export function createLook(data: Omit<Look, "id" | "createdAt">): Look {
  const looks = readLooks()
  const look: Look = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  looks.push(look)
  writeLooks(looks)
  return look
}

export function updateLook(
  id: string,
  data: Partial<Omit<Look, "id" | "createdAt">>
): Look | null {
  const looks = readLooks()
  const index = looks.findIndex((l) => l.id === id)
  if (index === -1) return null
  looks[index] = { ...looks[index], ...data }
  writeLooks(looks)
  return looks[index]
}

export function deleteLook(id: string): boolean {
  const looks = readLooks()
  const index = looks.findIndex((l) => l.id === id)
  if (index === -1) return false
  looks.splice(index, 1)
  writeLooks(looks)
  return true
}
