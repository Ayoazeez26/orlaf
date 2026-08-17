const STORAGE_KEY = "sable_studio_id"

export function getActiveStudioId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function setActiveStudioId(id: string | null) {
  if (typeof window === "undefined") return
  if (!id) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, id)
}
