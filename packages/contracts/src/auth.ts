/**
 * @sable/contracts — auth
 *
 * Shared auth types consumed by the API, creator-web, admin-web, and mobile.
 * Never define these in the app layer.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export enum AccountType {
  USER = "user",
  CREATOR = "creator",
  ADMIN = "admin",
}

export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  CONTENT_ADMIN = "content_admin",
  MARKETING_ADMIN = "marketing_admin",
  FINANCE_ADMIN = "finance_admin",
  SUPPORT_ADMIN = "support_admin",
}

export enum CreatorState {
  PENDING_APPROVAL = "pending_approval",
  ACTIVE = "active",
  SUSPENDED = "suspended",
  REJECTED = "rejected",
}

export enum OAuthProvider {
  GOOGLE = "google",
  APPLE = "apple",
  EMAIL = "email",
}

export enum ProviderTokenErrorCode {
  EXPIRED = "EXPIRED",
  WRONG_AUDIENCE = "WRONG_AUDIENCE",
  WRONG_ISSUER = "WRONG_ISSUER",
  BAD_SIGNATURE = "BAD_SIGNATURE",
  JWKS_UNREACHABLE = "JWKS_UNREACHABLE",
  INVALID_TOKEN = "INVALID_TOKEN",
}

export enum SignInErrorCode {
  VERIFICATION_FAILED = "VERIFICATION_FAILED",
  EMAIL_REGISTERED_WITH_OTHER_PROVIDER = "email_already_registered_with_other_provider",
  EMAIL_ALREADY_REGISTERED = "email_already_registered",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_NOT_VERIFIED = "email_not_verified",
  INVALID_CODE = "invalid_code",
  CODE_EXPIRED = "code_expired",
  TOO_MANY_ATTEMPTS = "too_many_attempts",
  RESEND_COOLDOWN = "resend_cooldown",
}

// ─────────────────────────────────────────────────────────────────────────────
// Account states
// ─────────────────────────────────────────────────────────────────────────────

/** States visible in sign-in responses and client-facing APIs */
export type AccountState =
  | "active"
  | "onboarding"
  | "pending_approval"
  | "suspended"
  | "rejected"
  | "pending_deletion"

// ─────────────────────────────────────────────────────────────────────────────
// JWT
// ─────────────────────────────────────────────────────────────────────────────

export interface AccessTokenClaims {
  /** account_id — maps to JWT `sub` */
  sub: string
  account_type: AccountType
  /** Null for USER and CREATOR account types */
  role: AdminRole | null
  iat: number
  exp: number
  iss: string
}

export interface IssueAccessTokenInput {
  account_id: string
  account_type: AccountType
  role: AdminRole | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider token verification
// ─────────────────────────────────────────────────────────────────────────────

export interface VerifyProviderIdTokenInput {
  provider: OAuthProvider
  id_token: string
  surface: "mobile" | "web"
}

export interface ProviderTokenClaims {
  sub: string
  email: string
  email_verified: boolean
  /** Present on Google always. Present on Apple only on first sign-in. */
  name?: string
  /** Apple only */
  is_private_email?: boolean
}

export class ProviderTokenError extends Error {
  constructor(
    message: string,
    public readonly code: ProviderTokenErrorCode
  ) {
    super(message)
    this.name = "ProviderTokenError"
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sign-in — request bodies
// ─────────────────────────────────────────────────────────────────────────────

export type SignInSurface = "mobile" | "creator-web"

export interface GoogleSignInBody {
  /** ID token returned by Google Sign-In SDK */
  id_token: string
  surface: SignInSurface
  device_label?: string
  user_agent?: string
}

export interface AppleSignInBody {
  /** Identity token returned by Apple Sign In SDK */
  id_token: string
  surface: SignInSurface
  device_label?: string
  /** Apple only returns name on first sign-in */
  name?: {
    given_name?: string | null
    family_name?: string | null
  }
  is_private_email?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Sign-in — response
// ─────────────────────────────────────────────────────────────────────────────

export interface SignInResponse {
  access_token: string
  /** Mobile only — omitted for creator-web (delivered via httpOnly cookie) */
  refresh_token?: string
  account_type: "user" | "creator"
  account_state: AccountState
  display_name: string | null
  needs_consent: boolean
  account_restored: boolean
  email: string
  /** Present when creator 2FA is enabled — complete via POST /auth/2fa/verify */
  requires_2fa?: boolean
  mfa_token?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Token refresh
// ─────────────────────────────────────────────────────────────────────────────

export interface RefreshRequest {
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
  /** Mobile only */
  refresh_token?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────────────────────────────────────

export interface LogoutRequest {
  refresh_token?: string
  logout_all?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Consent
// ─────────────────────────────────────────────────────────────────────────────

export interface PolicyVersions {
  terms: string
  privacy: string
  community_guidelines: string
  payment: string
}

export interface ConsentRequest {
  accepted: true
  policyVersions: PolicyVersions
}

export interface ConsentResponse {
  consentGiven: boolean
  consentTimestamp: string // ISO 8601
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin sign-in (username + password, separate subdomain)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminSignInRequest {
  email: string
  password: string
}

export interface AdminSignInResponse {
  access_token: string
  refresh_token: string
  role: AdminRole
  must_change_password: boolean
  admin: {
    id: string
    email: string
    display_name: string | null
  }
}

export type AdminSessionResponse = Omit<
  AdminSignInResponse,
  "access_token" | "refresh_token"
>

export interface AdminPasswordChangeRequest {
  currentPassword: string
  newPassword: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Email sign-up / verification
// ─────────────────────────────────────────────────────────────────────────────

export interface EmailSignUpBody {
  firstName: string
  lastName: string
  email: string
  password: string
  /** Defaults to creator-web when omitted (legacy creator-web clients). */
  surface?: SignInSurface
  /** Creator invite token from `/onboarding?invite=…` */
  invite_token?: string
}

export interface EmailSignInBody {
  email: string
  password: string
  surface: SignInSurface
  device_label?: string
  user_agent?: string
}
export interface VerifyEmailInput {
  verification_id: string
  code: string
  surface?: SignInSurface
  device_label?: string
  user_agent?: string
  /** Marks the invite accepted when email verification succeeds */
  invite_token?: string
}

export interface EmailSignUpResponse {
  verification_id: string
  expires_in_seconds: number
  masked_email: string
}

export interface VerifyEmailBody {
  verification_id: string
  code: string
  invite_token?: string
}

export interface ResendVerificationBody {
  verification_id: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Security — sessions, password, 2FA (creators)
// ─────────────────────────────────────────────────────────────────────────────

export interface ActiveSession {
  id: string
  device: string
  location: string
  browser: string
  lastActiveAt: string
  current: boolean
}

export interface ActiveSessionsResponse {
  sessions: ActiveSession[]
}

export interface SecurityStatusResponse {
  has_password: boolean
  can_set_password: boolean
  totp_enabled: boolean
  sms_available: boolean
}

export interface SetPasswordRequest {
  password: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface TotpSetupResponse {
  otpauthUrl: string
  secret: string
}

export interface TotpCodeRequest {
  code: string
}

export interface VerifyMfaRequest {
  mfa_token: string
  code: string
}

export interface VerifyMfaResponse {
  access_token: string
  refresh_token?: string
  account_type: "creator"
  account_state: AccountState
  display_name: string | null
  needs_consent: boolean
  account_restored: boolean
  email: string
}
