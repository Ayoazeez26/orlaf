import type {
  ConsentRequest,
  GoogleSignInBody,
  PolicyVersions,
  SignInResponse,
} from "@sable/contracts"
import { getApiBaseUrl } from "@/lib/api-base-url"
import { ApiError, apiRequest } from "@/lib/http-client"

const API_BASE_URL = getApiBaseUrl()

export type SignInGoogleResult =
  | { outcome: "success"; data: SignInResponse }
  | { outcome: "conflict"; provider: string }
  | { outcome: "verification_failed" }
  | { outcome: "error"; message: string }

export async function signInWithGoogle(
  idToken: string
): Promise<SignInGoogleResult> {
  const body: GoogleSignInBody = {
    id_token: idToken,
    surface: "creator-web",
    device_label: navigator.userAgent.slice(0, 120),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/sign-in/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    })

    if (response.status === 409) {
      const data = (await response.json()) as { provider?: string }
      return {
        outcome: "conflict",
        provider: data.provider ?? "another provider",
      }
    }

    if (response.status === 401) {
      const data = (await response.json()) as { error_code?: string }
      if (data.error_code === "VERIFICATION_FAILED") {
        return { outcome: "verification_failed" }
      }
      return { outcome: "error", message: "Sign-in failed. Please try again." }
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string
      }
      return {
        outcome: "error",
        message: data.message ?? `Sign-in failed (${response.status})`,
      }
    }

    const data = (await response.json()) as SignInResponse
    return { outcome: "success", data }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export async function refreshSession(): Promise<{ access_token: string }> {
  return apiRequest<{ access_token: string }>("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export async function logout(): Promise<void> {
  await apiRequest("/api/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export async function getPolicies(): Promise<PolicyVersions> {
  return apiRequest<PolicyVersions>("/api/v1/auth/policies", {
    method: "GET",
  })
}

export async function recordConsent(body: ConsentRequest): Promise<void> {
  await apiRequest("/api/v1/auth/users/consent", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export { ApiError }
