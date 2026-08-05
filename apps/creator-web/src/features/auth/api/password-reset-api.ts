import type {
  PasswordResetConfirmResponse,
  PasswordResetRequestResponse,
  PasswordResetVerifyOtpResponse,
} from "@sable/contracts"
import { apiFetch } from "@/lib/http-client"

type ApiErrorBody = {
  error_code?: string
  message?: string | string[]
  retry_after_seconds?: number
}

function parseErrorMessage(body: ApiErrorBody, fallback: string): string {
  if (Array.isArray(body.message)) return body.message.join(", ")
  if (typeof body.message === "string") return body.message
  return fallback
}

async function parseJsonBody(response: Response): Promise<ApiErrorBody> {
  return (await response.json().catch(() => ({}))) as ApiErrorBody
}

export type RequestPasswordResetResult =
  | { outcome: "success"; data: PasswordResetRequestResponse }
  | { outcome: "error"; message: string }

export async function requestPasswordReset(
  email: string
): Promise<RequestPasswordResetResult> {
  try {
    const response = await apiFetch("/api/v1/auth/password-reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await parseJsonBody(response)

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(
          data,
          `Unable to start password reset (${response.status})`
        ),
      }
    }

    return {
      outcome: "success",
      data: data as unknown as PasswordResetRequestResponse,
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type VerifyPasswordResetOtpResult =
  | { outcome: "success"; data: PasswordResetVerifyOtpResponse }
  | { outcome: "invalid_code"; message: string }
  | { outcome: "code_expired"; message: string }
  | { outcome: "too_many_attempts"; message: string }
  | { outcome: "error"; message: string }

export async function verifyPasswordResetOtp(input: {
  resetId: string
  code: string
}): Promise<VerifyPasswordResetOtpResult> {
  try {
    const response = await apiFetch("/api/v1/auth/password-reset/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset_id: input.resetId, code: input.code }),
    })

    const data = await parseJsonBody(response)

    if (response.status === 401 && data.error_code === "invalid_code") {
      return {
        outcome: "invalid_code",
        message: parseErrorMessage(data, "Invalid or expired code."),
      }
    }

    if (response.status === 410 || data.error_code === "code_expired") {
      return {
        outcome: "code_expired",
        message: parseErrorMessage(
          data,
          "This code has expired. Please request a new one."
        ),
      }
    }

    if (response.status === 429 || data.error_code === "too_many_attempts") {
      return {
        outcome: "too_many_attempts",
        message: parseErrorMessage(
          data,
          "Too many attempts. Please request a new code."
        ),
      }
    }

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(data, "Unable to verify code."),
      }
    }

    return {
      outcome: "success",
      data: data as unknown as PasswordResetVerifyOtpResponse,
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type ResendPasswordResetOtpResult =
  | { outcome: "success" }
  | { outcome: "cooldown"; retryAfterSeconds: number; message: string }
  | { outcome: "error"; message: string }

export async function resendPasswordResetOtp(
  resetId: string
): Promise<ResendPasswordResetOtpResult> {
  try {
    const response = await apiFetch("/api/v1/auth/password-reset/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset_id: resetId }),
    })

    if (response.status === 204) {
      return { outcome: "success" }
    }

    const data = await parseJsonBody(response)

    if (response.status === 429 || data.error_code === "resend_cooldown") {
      return {
        outcome: "cooldown",
        retryAfterSeconds: data.retry_after_seconds ?? 60,
        message: parseErrorMessage(
          data,
          "Please wait before requesting another code."
        ),
      }
    }

    return {
      outcome: "error",
      message: parseErrorMessage(data, "Unable to resend code."),
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type ConfirmPasswordResetResult =
  | { outcome: "success" }
  | { outcome: "requires_2fa"; mfaToken: string }
  | { outcome: "error"; message: string }

export async function confirmPasswordReset(input: {
  resetToken: string
  password: string
}): Promise<ConfirmPasswordResetResult> {
  try {
    const response = await apiFetch("/api/v1/auth/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reset_token: input.resetToken,
        password: input.password,
      }),
    })

    if (response.status === 204) {
      return { outcome: "success" }
    }

    const data = await parseJsonBody(response)

    if (response.ok) {
      const confirmData = data as unknown as PasswordResetConfirmResponse
      if (confirmData.requires_2fa && confirmData.mfa_token) {
        return {
          outcome: "requires_2fa",
          mfaToken: confirmData.mfa_token,
        }
      }
    }

    return {
      outcome: "error",
      message: parseErrorMessage(data, "Unable to reset password."),
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type VerifyPasswordResetMfaResult =
  | { outcome: "success" }
  | { outcome: "invalid_code"; message: string }
  | { outcome: "error"; message: string }

export async function verifyPasswordResetMfa(input: {
  mfaToken: string
  code: string
}): Promise<VerifyPasswordResetMfaResult> {
  try {
    const response = await apiFetch("/api/v1/auth/password-reset/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfa_token: input.mfaToken,
        code: input.code,
      }),
    })

    if (response.status === 204) {
      return { outcome: "success" }
    }

    const data = await parseJsonBody(response)

    if (response.status === 400) {
      return {
        outcome: "invalid_code",
        message: parseErrorMessage(data, "Invalid verification code."),
      }
    }

    return {
      outcome: "error",
      message: parseErrorMessage(data, "Unable to verify authenticator code."),
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}
