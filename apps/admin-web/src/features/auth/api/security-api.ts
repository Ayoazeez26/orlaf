import type {
  SecurityStatusResponse,
  TotpCodeRequest,
  TotpSetupResponse,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export async function fetchSecurityStatus(): Promise<SecurityStatusResponse> {
  return apiRequest<SecurityStatusResponse>("/api/v1/auth/security/status", {
    method: "GET",
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
