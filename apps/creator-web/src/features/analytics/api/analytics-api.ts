import { MOCK_ANALYTICS_DASHBOARD } from "../data/mock-analytics"
import type { AnalyticsDashboardData } from "../types"

const MOCK_DELAY_MS = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS)
  })
}

export async function fetchAnalyticsDashboard(): Promise<AnalyticsDashboardData> {
  return delay({ ...MOCK_ANALYTICS_DASHBOARD })
}
