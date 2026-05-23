// ─────────────────────────────────────────────────────────────────────────────
// Auth – OAuth sign-in
// ─────────────────────────────────────────────────────────────────────────────

/** POST /auth/google */
export interface SignInGoogleRequest {
  /** ID token returned by Google Sign-In SDK. */
  idToken: string;
}

/** POST /auth/apple */
export interface SignInAppleRequest {
  /** Identity token returned by Apple Sign In SDK. */
  identityToken: string;
  /**
   * Full name provided by Apple on first sign-in.
   * Apple only sends this once; store it on your side immediately.
   */
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
  };
}

/**
 * Successful response for both Google and Apple sign-in.
 * Matches the body fields agreed in KAN-8.
 */
export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  /** Seconds until `accessToken` expires. */
  expiresIn: number;
  user: {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    /** Whether the user has completed the consent / onboarding flow. */
    consentGiven: boolean;
    role: UserRole;
  };
}

export type UserRole = "VIEWER" | "CREATOR" | "ADMIN";

// ─────────────────────────────────────────────────────────────────────────────
// Auth – token refresh
// ─────────────────────────────────────────────────────────────────────────────

/** POST /auth/refresh */
export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth – logout
// ─────────────────────────────────────────────────────────────────────────────

/** POST /auth/logout */
export interface LogoutRequest {
  /** Invalidate this specific refresh token (device logout). */
  refreshToken: string;
}

// 200 with empty body — no LogoutResponse needed.

// ─────────────────────────────────────────────────────────────────────────────
// Auth – consent / onboarding
// ─────────────────────────────────────────────────────────────────────────────

/** POST /auth/consent */
export interface ConsentRequest {
  /** Must be `true`; backend rejects explicit false. */
  accepted: true;
  /** Semver string of the Terms version the user agreed to, e.g. "1.0.0". */
  termsVersion: string;
}

export interface ConsentResponse {
  consentGiven: boolean;
  consentTimestamp: string; // ISO 8601
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth – admin
// ─────────────────────────────────────────────────────────────────────────────

/** POST /admin/auth/sign-in  (email + password, not OAuth) */
export interface AdminSignInRequest {
  email: string;
  password: string;
}

export interface AdminSignInResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  admin: {
    id: string;
    email: string;
    displayName: string | null;
  };
}

/** POST /admin/auth/change-password */
export interface AdminPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// 200 with empty body — no AdminPasswordChangeResponse needed.