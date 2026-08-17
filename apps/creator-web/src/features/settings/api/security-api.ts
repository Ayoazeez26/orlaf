import type {
  ActiveSessionsResponse,
  ChangePasswordRequest,
  SecurityStatusResponse,
  SetPasswordRequest,
  TotpCodeRequest,
  TotpSetupResponse,
  VerifyMfaRequest,
  VerifyMfaResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export async function fetchSecurityStatus(): Promise<SecurityStatusResponse> {
  return apiRequest<SecurityStatusResponse>("/api/v1/auth/security/status", {
    method: "GET",
  })
}

export async function fetchActiveSessions(): Promise<ActiveSessionsResponse> {
  return apiRequest<ActiveSessionsResponse>("/api/v1/auth/sessions", {
    method: "GET",
  })
}

export async function revokeSession(sessionId: string): Promise<void> {
  await apiRequest(`/api/v1/auth/sessions/${sessionId}`, {
    method: "DELETE",
  })
}

export async function revokeOtherSessions(): Promise<void> {
  await apiRequest("/api/v1/auth/sessions/revoke-others", {
    method: "POST",
  })
}

export async function setPassword(body: SetPasswordRequest): Promise<void> {
  await apiRequest("/api/v1/auth/password/set", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function changePassword(
  body: ChangePasswordRequest
): Promise<void> {
  await apiRequest("/api/v1/auth/password/change", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function setupTotp(): Promise<TotpSetupResponse> {
  return apiRequest<TotpSetupResponse>("/api/v1/auth/2fa/totp/setup", {
    method: "POST",
  })
}

export async function enableTotp(body: TotpCodeRequest): Promise<void> {
  await apiRequest("/api/v1/auth/2fa/totp/enable", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function disableTotp(body: TotpCodeRequest): Promise<void> {
  await apiRequest("/api/v1/auth/2fa/totp/disable", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function verifyMfa(
  body: VerifyMfaRequest
): Promise<VerifyMfaResponse> {
  return apiRequest<VerifyMfaResponse>("/api/v1/auth/2fa/verify", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
