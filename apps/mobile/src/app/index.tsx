import { Redirect } from "expo-router"
import { ActivityIndicator, View } from "react-native"
import { useAuth } from "../context/auth-context"

export default function Index() {
  const { status } = useAuth()

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#7C3AED" />
      </View>
    )
  }

  // Always go to dashboard — guest or authenticated
  return <Redirect href="/onboarding" />
}
