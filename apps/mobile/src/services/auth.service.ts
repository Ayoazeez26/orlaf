/**
 * KAN-10 / KAN-11 — Auth service
 *
 * Orchestrates Google and Apple sign-in:
 * 1. Triggers native SDK
 * 2. POSTs ID token to backend via http-client
 * 3. Persists tokens in OS secure storage
 * 4. Returns typed result for the screen to route on
 *
 * Google and Apple flows are guarded behind HAS_GOOGLE_KEYS / HAS_APPLE_KEYS
 * so the app doesn't crash when client IDs are not yet configured.
 *
 * TODO(KAN-53): attach Sentry breadcrumbs and W3C traceparent
 */

import type { SignInResponse } from "@sable/contracts"
import Constants from "expo-constants"
import * as Device from "expo-device"
import { router } from "expo-router"
import { Platform, TurboModuleRegistry } from "react-native"
import { setInMemoryAccessToken } from "../lib/http-client"
import { TokenStore } from "./token-store.service"

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.sable.app"

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  "https://api.sable.app"

// Feature flags — flip to true once keys are configured
// const HAS_GOOGLE_KEYS =
//   !!process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID &&
//   !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
// const HAS_APPLE_KEYS = !!process.env.EXPO_PUBLIC_APPLE_SERVICE_ID_MOBILE

function getGoogleClientIds() {
  return {
    iosClientId:
      Constants.expoConfig?.extra?.googleIosClientId ??
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId:
      Constants.expoConfig?.extra?.googleWebClientId ??
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }
}

const HAS_GOOGLE_KEYS = (() => {
  const { iosClientId, webClientId } = getGoogleClientIds()
  return !!(iosClientId && webClientId)
})()

const HAS_APPLE_KEYS = !!process.env.EXPO_PUBLIC_APPLE_SERVICE_ID_MOBILE

export type SignInResult =
  | { outcome: "success"; data: SignInResponse }
  | { outcome: "cancelled" }
  | { outcome: "network_error"; error: Error }
  | { outcome: "conflict"; provider: string }
  | { outcome: "not_configured" }
  | { outcome: "native_unavailable" }
  | { outcome: "error"; error: Error }

function isGoogleSignInNativeAvailable(): boolean {
  return TurboModuleRegistry.get("RNGoogleSignin") != null
}

function loadGoogleSignInModule():
  | typeof import("@react-native-google-signin/google-signin")
  | null {
  if (!isGoogleSignInNativeAvailable()) return null
  try {
    return require("@react-native-google-signin/google-signin")
  } catch {
    return null
  }
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code
    return code == null ? undefined : String(code)
  }
  return undefined
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function getDeviceLabel(): string {
  return `${Device.manufacturer ?? ""} ${Device.modelName ?? ""}`.trim()
}

async function postSignIn(
  endpoint: string,
  body: Record<string, unknown>
): Promise<SignInResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // TODO(KAN-53): "traceparent": generateTraceparent(),
      },
      body: JSON.stringify(body),
    })

    if (response.status === 409) {
      const data = await response.json()
      return {
        outcome: "conflict",
        provider: data.provider ?? "another provider",
      }
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data?.message ?? `Sign-in failed: ${response.status}`)
    }

    const data: SignInResponse = await response.json()

    if (!data.refresh_token) {
      throw new Error("No refresh token returned")
    }

    // Persist tokens
    await TokenStore.saveTokens(data.access_token, data.refresh_token)
    setInMemoryAccessToken(data.access_token)

    return { outcome: "success", data }
  } catch (err: unknown) {
    if (
      err instanceof TypeError &&
      err.message.includes("Network request failed")
    ) {
      // TODO(KAN-53): Sentry.captureException(err)
      return { outcome: "network_error", error: err }
    }
    // TODO(KAN-53): Sentry.captureException(err)
    return {
      outcome: "error",
      error: err instanceof Error ? err : new Error(String(err)),
    }
  }
}

// ---------------------------------------------------------------------------
// Google (KAN-10)
// ---------------------------------------------------------------------------

export const GoogleAuthService = {
  isNativeAvailable(): boolean {
    return isGoogleSignInNativeAvailable()
  },

  configure() {
    if (!HAS_GOOGLE_KEYS || !isGoogleSignInNativeAvailable()) return
    const module = loadGoogleSignInModule()
    if (!module) return
    try {
      const { iosClientId, webClientId } = getGoogleClientIds()
      module.GoogleSignin.configure({
        iosClientId,
        webClientId,
      })
    } catch {
      // Native module not linked in this build
    }
  },

  async signIn(): Promise<SignInResult> {
    if (!HAS_GOOGLE_KEYS) return { outcome: "not_configured" }
    if (!isGoogleSignInNativeAvailable()) {
      return { outcome: "native_unavailable" }
    }

    const module = loadGoogleSignInModule()
    if (!module) return { outcome: "native_unavailable" }

    try {
      const { GoogleSignin } = module
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        })
      }
      const userInfo = await GoogleSignin.signIn()
      const idToken = userInfo.data?.idToken

      console.log("=== GOOGLE SIGN IN ===")
      console.log("API_BASE_URL:", API_BASE_URL)
      console.log("idToken exists:", !!idToken)
      console.log("idToken preview:", idToken?.substring(0, 50))

      if (!idToken) {
        return {
          outcome: "error",
          error: new Error("No ID token returned from Google"),
        }
      }

      const result = await postSignIn("auth/sign-in/google", {
        id_token: idToken,
        surface: "mobile",
        device_label: getDeviceLabel() || undefined,
      })

      console.log("postSignIn result:", result.outcome)
      return result
    } catch (err: unknown) {
      console.log("=== GOOGLE SIGN IN ERROR ===")
      console.log("code:", getErrorCode(err))
      console.log("message:", getErrorMessage(err))

      const code = getErrorCode(err)
      const message = getErrorMessage(err)

      if (
        code === "SIGN_IN_CANCELLED" ||
        code === "-5" ||
        message.includes("cancelled")
      ) {
        return { outcome: "cancelled" }
      }
      return {
        outcome: "error",
        error: err instanceof Error ? err : new Error(message),
      }
    }
  },

  async signOut() {
    if (!HAS_GOOGLE_KEYS || !isGoogleSignInNativeAvailable()) return
    const module = loadGoogleSignInModule()
    if (!module) return
    try {
      await module.GoogleSignin.signOut()
    } catch {}
  },
}

// ---------------------------------------------------------------------------
// Apple (KAN-11)
// ---------------------------------------------------------------------------

export const AppleAuthService = {
  isAvailable(): boolean {
    // Apple sign-in only available on iOS
    return Platform.OS === "ios" && HAS_APPLE_KEYS
  },

  async signIn(): Promise<SignInResult> {
    if (!this.isAvailable()) return { outcome: "not_configured" }

    try {
      const AppleAuthentication = require("expo-apple-authentication")

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      const idToken = credential.identityToken
      if (!idToken) {
        return {
          outcome: "error",
          error: new Error("No identity token from Apple"),
        }
      }

      // Apple only returns full name on first sign-in
      const firstName = credential.fullName?.givenName
      const lastName = credential.fullName?.familyName
      const hasName = firstName || lastName

      return postSignIn("auth/sign-in/apple", {
        id_token: idToken,
        surface: "mobile",
        device_label: getDeviceLabel() || undefined,
        ...(hasName && {
          name: {
            given_name: firstName ?? null,
            family_name: lastName ?? null,
          },
        }),
      })
    } catch (err: unknown) {
      if (getErrorCode(err) === "ERR_REQUEST_CANCELED") {
        return { outcome: "cancelled" }
      }
      // TODO(KAN-53): Sentry.captureException(err)
      return {
        outcome: "error",
        error: err instanceof Error ? err : new Error(getErrorMessage(err)),
      }
    }
  },
}

// ---------------------------------------------------------------------------
// Email (future backend story)
// ---------------------------------------------------------------------------

export const EmailAuthService = {
  async signIn(email: string, password: string): Promise<SignInResult> {
    return postSignIn("auth/sign-in/email", { email, password })
  },
}

// ---------------------------------------------------------------------------
// Shared result router — used by sign-in screens
// ---------------------------------------------------------------------------

export function handleSignInResult(
  result: SignInResult,
  onNetworkError: () => void
) {
  switch (result.outcome) {
    case "cancelled":
      return // silent

    case "not_configured": {
      const { Alert } = require("react-native")
      Alert.alert(
        "Google Sign-In unavailable",
        "Google client IDs are not configured for this build. Add EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID and EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, then restart the app."
      )
      return
    }

    case "native_unavailable": {
      const { Alert } = require("react-native")
      Alert.alert(
        "Development build required",
        "Google Sign-In does not work in Expo Go. Run `pnpm ios` in apps/mobile, then open the Sable TV dev client on your simulator."
      )
      return
    }

    case "network_error":
      onNetworkError()
      return

    case "conflict": {
      router.replace({
        pathname: "/auth/duplicate-email",
        params: { provider: result.provider },
      })
      return
    }

    case "error": {
      const { Alert } = require("react-native")
      Alert.alert("Sign-in failed", "Something went wrong. Please try again.")
      return
    }

    case "success": {
      if (result.data.account_restored) {
        router.replace({ pathname: "/dashboard", params: { restored: "1" } })
        return
      }
      if (result.data.needs_consent) {
        router.replace("/auth/consent")
        return
      }
      router.replace("/dashboard")
      return
    }
  }
}
