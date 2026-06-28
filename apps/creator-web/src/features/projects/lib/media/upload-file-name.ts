/** Derive an MP4 filename from the original upload name (keeps base name). */
export function toMp4FileName(originalName: string): string {
  const trimmed = originalName.trim()
  if (!trimmed) return "video.mp4"
  if (/\.mp4$/i.test(trimmed)) return trimmed
  const base = trimmed.replace(/\.[^/.]+$/, "") || "video"
  return `${base}.mp4`
}
