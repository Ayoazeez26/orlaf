import type {
  ConsentRequest,
  EmailSignInBody,
  EmailSignUpBody,
  EmailSignUpResponse,
  GoogleSignInBody,
  PolicyVersions,
  SignInResponse,
  VerifyEmailBody,
} from "@sable/contracts"
import { ApiError, apiFetch, apiRequest } from "@/lib/http-client"

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
    const response = await apiFetch("/api/v1/auth/sign-in/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

export async function fetchAuthSession(): Promise<
  Omit<SignInResponse, "access_token" | "refresh_token">
> {
  return apiRequest<Omit<SignInResponse, "access_token" | "refresh_token">>(
    "/api/v1/auth/session",
    { method: "GET" }
  )
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

type ApiErrorBody = {
  error_code?: string
  message?: string | string[]
  verification_id?: string | null
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

export type SignUpEmailResult =
  | { outcome: "success"; data: EmailSignUpResponse }
  | {
      outcome: "conflict"
      errorCode: string
      provider?: string
      message: string
    }
  | { outcome: "error"; message: string }

export async function signUpWithEmail(
  body: EmailSignUpBody
): Promise<SignUpEmailResult> {
  try {
    const response = await apiFetch("/api/v1/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await parseJsonBody(response)

    if (response.status === 409) {
      return {
        outcome: "conflict",
        errorCode: data.error_code ?? "email_already_registered",
        provider: (data as { provider?: string }).provider,
        message: parseErrorMessage(data, "This email is already registered."),
      }
    }

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(data, `Sign-up failed (${response.status})`),
      }
    }

    return { outcome: "success", data: data as unknown as EmailSignUpResponse }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type VerifyEmailResult =
  | { outcome: "success"; data: SignInResponse }
  | { outcome: "invalid_code"; message: string }
  | { outcome: "code_expired"; message: string }
  | { outcome: "too_many_attempts"; message: string }
  | { outcome: "error"; message: string }

export async function verifyEmail(
  body: VerifyEmailBody & { surface?: "creator-web" }
): Promise<VerifyEmailResult> {
  try {
    const response = await apiFetch("/api/v1/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        surface: body.surface ?? "creator-web",
        device_label: navigator.userAgent.slice(0, 120),
      }),
    })

    const data = await parseJsonBody(response)

    if (response.status === 401 && data.error_code === "invalid_code") {
      return {
        outcome: "invalid_code",
        message: parseErrorMessage(data, "Invalid verification code."),
      }
    }

    if (response.status === 410 || data.error_code === "code_expired") {
      return {
        outcome: "code_expired",
        message: parseErrorMessage(
          data,
          "Verification code has expired. Please request a new one."
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
        message: parseErrorMessage(
          data,
          `Verification failed (${response.status})`
        ),
      }
    }

    return { outcome: "success", data: data as unknown as SignInResponse }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}

export type ResendVerificationResult =
  | { outcome: "success" }
  | { outcome: "cooldown"; retryAfterSeconds: number; message: string }
  | { outcome: "error"; message: string }

export async function resendVerification(
  verificationId: string
): Promise<ResendVerificationResult> {
  try {
    const response = await apiFetch("/api/v1/auth/verify-email/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_id: verificationId }),
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

export type SignInEmailResult =
  | { outcome: "success"; data: SignInResponse }
  | { outcome: "invalid_credentials"; message: string }
  | {
      outcome: "email_not_verified"
      verificationId: string | null
      message: string
    }
  | { outcome: "error"; message: string }

export async function signInWithEmail(
  body: Omit<EmailSignInBody, "surface" | "device_label"> & {
    surface?: EmailSignInBody["surface"]
  }
): Promise<SignInEmailResult> {
  const payload: EmailSignInBody = {
    ...body,
    surface: body.surface ?? "creator-web",
    device_label: navigator.userAgent.slice(0, 120),
  }

  try {
    const response = await apiFetch("/api/v1/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await parseJsonBody(response)

    if (response.status === 401 && data.error_code === "invalid_credentials") {
      return {
        outcome: "invalid_credentials",
        message: parseErrorMessage(data, "Invalid email or password."),
      }
    }

    if (response.status === 403 && data.error_code === "email_not_verified") {
      return {
        outcome: "email_not_verified",
        verificationId: data.verification_id ?? null,
        message: parseErrorMessage(
          data,
          "Please verify your email before signing in."
        ),
      }
    }

    if (!response.ok) {
      return {
        outcome: "error",
        message: parseErrorMessage(data, `Sign-in failed (${response.status})`),
      }
    }

    return { outcome: "success", data: data as unknown as SignInResponse }
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and API URL.",
    }
  }
}
