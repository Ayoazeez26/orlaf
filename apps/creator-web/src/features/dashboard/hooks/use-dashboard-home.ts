import { useMemo } from "react"
import { useAuth } from "@/features/auth/auth-context"
import { MOCK_DASHBOARD_HOME } from "../data/mock-home"
import type { DashboardHomeData, DashboardUser } from "../types"

function buildUserFromSession(
  email: string,
  displayName: string | null
): DashboardUser {
  const fullName = displayName?.trim() || email.split("@")[0] || "Creator"
  const parts = fullName.split(/\s+/).filter(Boolean)
  const initials =
    parts.length >= 2
      ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase()

  return {
    displayName: parts[0] ?? fullName,
    fullName,
    role: "Sable Creator",
    initials,
  }
}

export function useDashboardHome(): DashboardHomeData {
  const { session } = useAuth()

  return useMemo(() => {
    const user =
      session?.email != null
        ? buildUserFromSession(session.email, session.display_name)
        : MOCK_DASHBOARD_HOME.user

    return {
      ...MOCK_DASHBOARD_HOME,
      user,
    }
  }, [session])
}
