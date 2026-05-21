import { useMemo } from "react"
import { MOCK_DASHBOARD_HOME } from "../data/mock-home"
import type { DashboardHomeData } from "../types"

export function useDashboardHome(): DashboardHomeData {
  return useMemo(() => MOCK_DASHBOARD_HOME, [])
}
