import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useEmailSignIn } from "../../hooks/use-auth"

export default function SignInEmailScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // const emailSignIn = useEmailSignIn()
  const [_, setNetworkError] = useState(false)
  const emailSignIn = useEmailSignIn(() => setNetworkError(true))

  const canSubmit = email.length > 0 && password.length >= 6

  async function handleLogin() {
    if (!canSubmit) return

    emailSignIn.mutate({ email, password }, {})
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
        <View className="items-center gap-1">
          <Text className="text-3xl text-white">
            <Text className="font-bold">Sable</Text> TV
          </Text>
          <Text className="text-center text-foreground text-sm">
            Watch, create, and connect.
          </Text>
        </View>

        {/* Card */}
        <View className="w-full gap-5 rounded-2xl border border-[#2E2E2E] bg-muted px-6 py-8">
          {/* Email */}
          <View className="gap-2">
            <Text className="font-medium text-sm text-white">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="h-13 rounded-xl border border-[#3A3A3A] bg-background px-4 text-base text-white"
            />
          </View>

          {/* Password */}
          <View className="gap-2">
            <Text className="font-medium text-sm text-white">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 characters"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                autoComplete="password"
                className="h-13 rounded-xl border border-[#3A3A3A] bg-background px-4 pr-12 text-base text-white"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-4 bottom-0 justify-center"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={emailSignIn.isPending || !canSubmit}
            className="items-center justify-center rounded-xl bg-[#2A2A2A] py-4"
            // style={{ backgroundColor: canSubmit ? undefined : "#2A2A2A" }}
            {...(canSubmit && {
              className:
                "items-center justify-center rounded-xl py-4 bg-primary active:opacity-80",
            })}
          >
            {emailSignIn.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-base text-white">Login</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center gap-1">
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
