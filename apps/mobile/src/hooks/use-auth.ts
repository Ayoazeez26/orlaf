import type { SignInResponse } from "@sable/contracts"
import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import { useAuth } from "../context/auth-context"
import {
  AppleAuthService,
  EmailAuthService,
  GoogleAuthService,
  type SignInResult,
} from "../services/auth.service"

// ---------------------------------------------------------------------------
// Shared result handler — uses auth context
// ---------------------------------------------------------------------------

function useHandleSignInResult(onNetworkError: () => void) {
  const { signIn } = useAuth()

  return async (result: SignInResult) => {
    switch (result.outcome) {
      case "cancelled":
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

      case "conflict":
        router.replace({
          pathname: "/auth/duplicate-email",
          params: { provider: result.provider },
        })
        return

      case "error": {
        const { Alert } = require("react-native")
        Alert.alert("Sign-in failed", "Something went wrong. Please try again.")
        return
      }

      case "success": {
        const user: Pick<SignInResponse, "email" | "display_name"> = {
          email: result.data.email,
          display_name: result.data.display_name,
        }
        if (!result.data.refresh_token) {
          const { Alert } = require("react-native")
          Alert.alert(
            "Sign-in failed",
            "Something went wrong. Please try again."
          )
          return
        }
        // Persist tokens and update auth context
        await signIn(result.data.access_token, result.data.refresh_token, user)

        if (result.data.account_restored) {
          router.replace({ pathname: "/dashboard", params: { restored: "1" } })
          return
        }
        if (result.data.needs_consent) {
          router.replace("/auth/consent")
          return
        }
        // router.replace("/dashboard") already called in signIn()
        return
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Google sign-in
// ---------------------------------------------------------------------------

export function useGoogleSignIn(onNetworkError: () => void) {
  const handleResult = useHandleSignInResult(onNetworkError)

  return useMutation<SignInResult>({
    mutationFn: () => GoogleAuthService.signIn(),
    onSuccess: handleResult,
  })
}

// ---------------------------------------------------------------------------
// Apple sign-in
// ---------------------------------------------------------------------------

export function useAppleSignIn(onNetworkError: () => void) {
  const handleResult = useHandleSignInResult(onNetworkError)

  return useMutation<SignInResult>({
    mutationFn: () => AppleAuthService.signIn(),
    onSuccess: handleResult,
  })
}

// ---------------------------------------------------------------------------
// Email sign-in
// ---------------------------------------------------------------------------

export interface EmailSignInInput {
  email: string
  password: string
}

export function useEmailSignIn(onNetworkError: () => void) {
  const handleResult = useHandleSignInResult(onNetworkError)

  return useMutation<SignInResult, Error, EmailSignInInput>({
    mutationFn: ({ email, password }) =>
      EmailAuthService.signIn(email, password),
    onSuccess: handleResult,
  })
}
