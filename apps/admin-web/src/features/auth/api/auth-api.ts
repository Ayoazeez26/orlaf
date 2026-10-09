import type {
  AdminPasswordChangeRequest,
  AdminSessionResponse,
  AdminSignInRequest,
  AdminSignInResponse,
  VerifyMfaRequest,
} from "@sable/contracts"
import { ApiError, apiFetch, apiRequest } from "@/lib/http-client"

export type SignInAdminResult =
  | { outcome: "success"; data: AdminSignInResponse }
  | { outcome: "requires_2fa"; mfaToken: string }
  | { outcome: "invalid_credentials"; message: string }
  | { outcome: "error"; message: string }

export type VerifyAdminMfaResult =
  | { outcome: "success"; data: AdminSignInResponse }
  | { outcome: "invalid_code"; message: string }
  | { outcome: "error"; message: string }

type ApiErrorBody = {
  error_code?: string
  message?: string | string[]
}

function parseErrorMessage(body: ApiErrorBody, fallback: string): string {
  if (Array.isArray(body.message)) return body.message.join(", ")
  if (typeof body.message === "string") return body.message
  return fallback
}

async function parseJsonBody(response: Response): Promise<ApiErrorBody> {
  return (await response.json().catch(() => ({}))) as ApiErrorBody
}

export async function signInAdmin(
  body: AdminSignInRequest
): Promise<SignInAdminResult> {
  try {
    const response = await apiFetch("/api/v1/auth/sign-in/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await parseJsonBody(response)

    if (response.status === 401) {
      return {
        outcome: "invalid_credentials",
        message: parseErrorMessage(data, "Invalid email or password."),
      }
    }

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(data, `Sign-in failed (${response.status})`),
      }
    }

    const signInData = data as unknown as AdminSignInResponse
    if (signInData.requires_2fa && signInData.mfa_token) {
      return { outcome: "requires_2fa", mfaToken: signInData.mfa_token }
    }

    return {
      outcome: "success",
      data: signInData,
    }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export async function verifyAdminMfa(
  body: VerifyMfaRequest
): Promise<VerifyAdminMfaResult> {
  try {
    const response = await apiFetch("/api/v1/auth/2fa/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await parseJsonBody(response)

    if (response.status === 401 || response.status === 400) {
      return {
        outcome: "invalid_code",
        message: parseErrorMessage(data, "Invalid verification code."),
      }
    }

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(
          data,
          `Verification failed (${response.status})`
        ),
      }
    }

    return { outcome: "success", data: data as unknown as AdminSignInResponse }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export async function changeAdminPassword(
  body: AdminPasswordChangeRequest
): Promise<void> {
  await apiRequest("/api/v1/auth/admin/password", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function refreshSession(): Promise<{ access_token: string }> {
  return apiRequest<{ access_token: string }>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ account_type: "admin" }),
  })
}

export async function fetchAdminSession(): Promise<AdminSessionResponse> {
  return apiRequest<AdminSessionResponse>("/api/v1/auth/admin/session", {
    method: "GET",
  })
}

export async function logout(): Promise<void> {
  await apiRequest("/api/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export { ApiError }
