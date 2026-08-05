const STORAGE_KEY = "sable_password_reset"

export interface PasswordResetSession {
  resetId: string
  maskedEmail: string
  resetToken?: string
}

export function readPasswordResetSession(): PasswordResetSession | null {
  if (typeof sessionStorage === "undefined") return null

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as PasswordResetSession
    if (!parsed.resetId || !parsed.maskedEmail) return null
    return parsed
  } catch {
    return null
  }
}

export function writePasswordResetSession(session: PasswordResetSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function updatePasswordResetSession(
  patch: Partial<PasswordResetSession>
): PasswordResetSession | null {
  const current = readPasswordResetSession()
  if (!current) return null

  const next = { ...current, ...patch }
  writePasswordResetSession(next)
  return next
}

export function clearPasswordResetSession(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
