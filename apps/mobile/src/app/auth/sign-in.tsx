import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useAppleSignIn, useGoogleSignIn } from "../../hooks/use-auth"

export default function SignInScreen() {
  const [networkError, setNetworkError] = useState(false)

  const googleSignIn = useGoogleSignIn(() => setNetworkError(true))
  const appleSignIn = useAppleSignIn(() => setNetworkError(true))

  const loading = googleSignIn.isPending || appleSignIn.isPending

  function handleGoogle() {
    setNetworkError(false)
    googleSignIn.mutate()
  }

  function handleApple() {
    setNetworkError(false)
    appleSignIn.mutate()
  }

  return (
    <View className="flex-1 bg-background">
      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-14 left-5 z-10 h-9 w-9 items-center justify-center rounded-full border border-[#2E2E2E] bg-muted"
      >
        <Ionicons name="arrow-back" size={18} color="#ccc" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center gap-8 px-6">
        {/* Wordmark */}
        <View className="items-center gap-3">
          <Image
            source={require("../../../assets/images/brand/sable-logo-white.png")}
            accessibilityLabel="Sable TV"
            style={{ width: 180, height: 48 }}
            resizeMode="contain"
          />
          <Text className="text-center text-foreground text-sm">
            Watch, create, and connect.
          </Text>
        </View>

        {/* Card */}
        <View className="w-full gap-4 rounded-2xl border border-[#2E2E2E] bg-muted px-6 py-8">
          <Text className="text-center font-bold text-white text-xl">
            Welcome Back
          </Text>
          <Text className="-mt-1 mb-2 text-center text-foreground text-sm">
            Login to continue streaming
          </Text>

          {/* Google */}
          <TouchableOpacity
            onPress={handleGoogle}
            disabled={loading}
            className="flex-row items-center justify-center gap-3 rounded-xl border border-[#3A3A3A] py-4 active:opacity-70 disabled:opacity-50"
          >
            {googleSignIn.isPending ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <Text
                className="w-5 text-center font-bold text-base"
                style={{ color: "#4285F4" }}
              >
                G
              </Text>
            )}
            <Text className="font-medium text-base text-white">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Apple — iOS only */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={handleApple}
              disabled={loading}
              className="flex-row items-center justify-center gap-3 rounded-xl border border-[#3A3A3A] py-4 active:opacity-70 disabled:opacity-50"
            >
              {appleSignIn.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="logo-apple" size={18} color="#fff" />
              )}
              <Text className="font-medium text-base text-white">
                Continue with Apple
              </Text>
            </TouchableOpacity>
          )}

          {/* Divider */}
          <View className="my-1 flex-row items-center gap-3">
            <View className="h-px flex-1 bg-[#2E2E2E]" />
            <Text className="text-foreground text-sm">or</Text>
            <View className="h-px flex-1 bg-[#2E2E2E]" />
          </View>

          {/* Email */}
          <TouchableOpacity
            onPress={() => router.push("/auth/sign-in-email")}
            disabled={loading}
            className="flex-row items-center justify-center gap-3 rounded-xl border border-[#3A3A3A] bg-primary py-4 active:opacity-70 disabled:opacity-50"
          >
            <Ionicons name="mail-outline" size={18} color="#ccc" />
            <Text className="font-medium text-base text-white">
              Continue with Email
            </Text>
          </TouchableOpacity>

          {/* Network error */}
          {networkError && (
            <View className="items-center gap-2">
              <Text className="text-center text-red-400 text-sm">
                No internet connection. Check your network and try again.
              </Text>
              <TouchableOpacity
                onPress={handleGoogle}
                className="rounded-lg border border-[#3A3A3A] px-6 py-2 active:opacity-70"
              >
                <Text className="font-medium text-sm text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}
          <View className="mt-2 items-center gap-1">
            <TouchableOpacity onPress={() => {}}>
              <Text className="font-medium text-foreground text-sm">
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <Text className="text-foreground text-sm">
              Don't have an account? <Text onPress={() => {}}>Sign up</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
