import { MOCK_REVENUE_DASHBOARD } from "../data/mock-revenue"
import type { PayoutFrequency, RevenueDashboardData } from "../types"

const MOCK_DELAY_MS = 200

let payoutFrequency: PayoutFrequency =
  MOCK_REVENUE_DASHBOARD.payoutSchedule.frequency

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS)
  })
}

function getDashboard(): RevenueDashboardData {
  return {
    ...MOCK_REVENUE_DASHBOARD,
    payoutSchedule: {
      ...MOCK_REVENUE_DASHBOARD.payoutSchedule,
      frequency: payoutFrequency,
    },
  }
}

export async function fetchRevenueDashboard(): Promise<RevenueDashboardData> {
  return delay(getDashboard())
}

export async function updatePayoutFrequency(
  frequency: PayoutFrequency
): Promise<RevenueDashboardData> {
  payoutFrequency = frequency
  return delay(getDashboard())
}
