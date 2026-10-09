export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

export function detectImageType(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg"
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value))
    return "image/png"
  const text = new TextDecoder("ascii")
  if (["GIF87a", "GIF89a"].includes(text.decode(bytes.slice(0, 6))))
    return "image/gif"
  if (
    text.decode(bytes.slice(0, 4)) === "RIFF" &&
    text.decode(bytes.slice(8, 12)) === "WEBP"
  )
    return "image/webp"
  return null
}
