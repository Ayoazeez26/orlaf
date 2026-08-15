import { useMemo } from "react"
import { DEFAULT_ANALYTICS_DATE_RANGE } from "@/features/analytics/constants"
import { useAnalyticsDashboard } from "@/features/analytics/hooks/use-analytics-dashboard"
import { useAuth } from "@/features/auth/auth-context"
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

const FALLBACK_USER: DashboardUser = {
  displayName: "Creator",
  fullName: "Creator",
  role: "Sable Creator",
  initials: "CR",
}

export function useDashboardHome(): DashboardHomeData & {
  isLoading: boolean
  isError: boolean
} {
  const { session } = useAuth()
  const { data, isPending, isError } = useAnalyticsDashboard(
    DEFAULT_ANALYTICS_DATE_RANGE
  )

  return useMemo(() => {
    const user =
      session?.email != null
        ? buildUserFromSession(session.email, session.display_name)
        : FALLBACK_USER

    if (!data) {
      return {
        user,
        kpis: [],
        engagementChart: [],
        topEpisodes: [],
        isLoading: isPending,
        isError,
      }
    }

    return {
      user,
      kpis: data.kpis.slice(0, 4),
      engagementChart: data.engagement.map((point) => ({
        day: point.label,
        primary: point.views,
        secondary: point.likes,
        tertiary: point.shares,
      })),
      topEpisodes: data.topEpisodes,
      isLoading: false,
      isError,
    }
  }, [session, data, isPending, isError])
}
