import type { SignInResponse } from "@sable/contracts"
import { router } from "expo-router"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { initHttpClient, setInMemoryAccessToken } from "../lib/http-client"
import { GoogleAuthService } from "../services/auth.service"
import { TokenStore } from "../services/token-store.service"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean
  user: Pick<SignInResponse, "email" | "display_name"> | null
  signIn: (
    accessToken: string,
    refreshToken: string,
    user: Pick<SignInResponse, "email" | "display_name"> | null
  ) => Promise<void>
  signOut: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
})

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Pick<
    SignInResponse,
    "email" | "display_name"
  > | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    async function bootstrap() {
      await initHttpClient()
      GoogleAuthService.configure()
      const token = await TokenStore.getAccessToken()
      setStatus(token ? "authenticated" : "unauthenticated")
      // no router.replace here
    }
    bootstrap()
  }, [])

  // Called after successful sign-in
  const signIn = useCallback(
    async (
      accessToken: string,
      refreshToken: string,
      authUser: Pick<SignInResponse, "email" | "display_name"> | null
    ) => {
      await TokenStore.saveTokens(accessToken, refreshToken)
      setInMemoryAccessToken(accessToken)
      setUser(authUser)
      setStatus("authenticated")
      router.replace("/dashboard")
    },
    []
  )

  // Called on sign-out
  const signOut = useCallback(async () => {
    try {
      const refreshToken = await TokenStore.getRefreshToken()
      if (refreshToken) {
        const { apiRequest } = await import("../lib/http-client")
        await apiRequest("/api/v1/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refresh_token: refreshToken }),
        }).catch(() => {}) // best effort
      }
    } finally {
      await TokenStore.clearTokens()
      setInMemoryAccessToken(null)
      setUser(null)
      setStatus("unauthenticated")
      router.replace("/auth/sign-in")
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  return useContext(AuthContext)
}
