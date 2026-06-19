/**
 * Current policy version IDs.
 *
 * Update these when any policy document changes.
 * The GET /auth/policies endpoint reads from this file.
 * The consent endpoint validates that the client accepted these exact versions.
 */
export const CURRENT_POLICY_VERSIONS = {
  terms: "1.0.0",
  privacy: "1.0.0",
  community_guidelines: "1.0.0",
  payment: "1.0.0",
} as const

export type PolicyVersions = typeof CURRENT_POLICY_VERSIONS
export type PolicyKey = keyof PolicyVersions
