// ─────────────────────────────────────────────────────────────────────────────
// Error code unions
// Add new codes here as the API grows; keep them grouped by HTTP status.
// ─────────────────────────────────────────────────────────────────────────────

/** Generic 401 – token missing, expired, or invalid. */
export type AuthErrorCode = "UNAUTHORIZED" | "TOKEN_EXPIRED" | "TOKEN_INVALID";

/** 409 – the OAuth email is already registered via a different provider. */
export type DuplicateEmailErrorCode = "DUPLICATE_EMAIL";

/** 429 – client has exceeded the rate limit for auth endpoints. */
export type RateLimitedErrorCode = "RATE_LIMITED";

/** 403 – user must complete the consent / onboarding flow first. */
export type ConsentRequiredErrorCode = "CONSENT_REQUIRED";

/** 403 – caller lacks the required admin permission. */
export type AdminPermissionDeniedErrorCode = "ADMIN_PERMISSION_DENIED";

/**
 * Union of every auth-related error code the API can return.
 * Consumers can narrow on `code` inside error response bodies.
 */
export type AnyAuthErrorCode =
  | AuthErrorCode
  | DuplicateEmailErrorCode
  | RateLimitedErrorCode
  | ConsentRequiredErrorCode
  | AdminPermissionDeniedErrorCode;

/** Standard error envelope returned by the backend on all 4xx/5xx responses. */
export interface ApiErrorResponse<TCode extends string = string> {
  code: TCode;
  message: string;
  /** Additional context for debugging — omitted in production for sensitive errors. */
  details?: Record<string, unknown>;
}