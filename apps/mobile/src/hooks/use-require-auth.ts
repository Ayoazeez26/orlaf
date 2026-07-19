// src/hooks/use-require-auth.ts
import { router } from "expo-router"
import { useAuth } from "../context/auth-context"

export function useRequireAuth() {
  const { isAuthenticated } = useAuth()

  return (action: () => void) => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in")
      return
    }
    action()
  }
}
