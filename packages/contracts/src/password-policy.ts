export const MIN_PASSWORD_LENGTH = 8

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 characters and include uppercase, lowercase, and a symbol."

export type PasswordRequirement =
  | "length"
  | "uppercase"
  | "lowercase"
  | "symbol"

export type PasswordStrengthLabel = "Weak" | "Fair" | "Good" | "Strong"

export interface PasswordRequirements {
  length: boolean
  uppercase: boolean
  lowercase: boolean
  symbol: boolean
}

export interface PasswordValidationResult {
  valid: boolean
  missing: PasswordRequirement[]
  message: string | null
}

export interface PasswordStrength {
  score: number
  percent: number
  label: PasswordStrengthLabel
  requirements: PasswordRequirements
}

const HAS_UPPERCASE = /[A-Z]/
const HAS_LOWERCASE = /[a-z]/
const HAS_SYMBOL = /[^A-Za-z0-9]/

export function getPasswordRequirements(
  password: string
): PasswordRequirements {
  return {
    length: password.length >= MIN_PASSWORD_LENGTH,
    uppercase: HAS_UPPERCASE.test(password),
    lowercase: HAS_LOWERCASE.test(password),
    symbol: HAS_SYMBOL.test(password),
  }
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = getPasswordRequirements(password)
  const missing = (
    Object.entries(requirements) as [PasswordRequirement, boolean][]
  )
    .filter(([, met]) => !met)
    .map(([key]) => key)

  return {
    valid: missing.length === 0,
    missing,
    message: missing.length === 0 ? null : PASSWORD_POLICY_MESSAGE,
  }
}

export function getPasswordStrength(password: string): PasswordStrength {
  const requirements = getPasswordRequirements(password)
  const metCount = Object.values(requirements).filter(Boolean).length
  const percent = (metCount / 4) * 100

  let label: PasswordStrengthLabel = "Weak"
  if (metCount >= 4) label = "Strong"
  else if (metCount === 3) label = "Good"
  else if (metCount === 2) label = "Fair"

  return {
    score: metCount,
    percent,
    label,
    requirements,
  }
}

export const PASSWORD_REQUIREMENT_LABELS: Record<PasswordRequirement, string> =
  {
    length: `At least ${MIN_PASSWORD_LENGTH} characters`,
    uppercase: "One uppercase letter",
    lowercase: "One lowercase letter",
    symbol: "One symbol",
  }
