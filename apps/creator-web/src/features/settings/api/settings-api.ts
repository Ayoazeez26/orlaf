import { MOCK_SETTINGS_DASHBOARD } from "../data/mock-settings"
import type { SettingsDashboardData } from "../types"

const MOCK_DELAY_MS = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS)
  })
}

export async function fetchSettingsDashboard(): Promise<SettingsDashboardData> {
  return delay(MOCK_SETTINGS_DASHBOARD)
}
