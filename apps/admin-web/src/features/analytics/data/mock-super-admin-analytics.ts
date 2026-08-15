import { DollarSign, PlayCircle, TrendingUp, Users } from "lucide-react"
import type { SuperAdminAnalytics } from "../types"

export const MOCK_SUPER_ADMIN_ANALYTICS: SuperAdminAnalytics = {
  kpis: [
    {
      label: "Revenue",
      value: "$62.3K",
      changePercent: 12.4,
      icon: DollarSign,
    },
    { label: "Active Users", value: "7.2K", changePercent: 8.1, icon: Users },
    {
      label: "Conversion",
      value: "7.2%",
      changePercent: 1.6,
      icon: TrendingUp,
    },
    {
      label: "Avg Completion",
      value: "59%",
      changePercent: -2.3,
      icon: PlayCircle,
    },
  ],
  revenue: [
    { week: "W1", revenue: 12500, subscriptions: 8000 },
    { week: "W2", revenue: 14000, subscriptions: 8600 },
    { week: "W3", revenue: 16000, subscriptions: 9600 },
    { week: "W4", revenue: 18500, subscriptions: 11000 },
  ],
  userGrowth: [
    { week: "W1", users: 1200, creators: 40 },
    { week: "W2", users: 1600, creators: 55 },
    { week: "W3", users: 2000, creators: 70 },
    { week: "W4", users: 2400, creators: 90 },
  ],
  retention: [
    { day: "D1", retention: 100 },
    { day: "D3", retention: 78 },
    { day: "D7", retention: 60 },
    { day: "D14", retention: 48 },
    { day: "D30", retention: 34 },
    { day: "D60", retention: 23 },
    { day: "D90", retention: 15 },
  ],
  retentionBadge: "48% @ D14",
  funnel: {
    subtitle: "7.2% of visitors convert to paid subscribers",
    stages: [
      {
        label: "Visitors",
        count: 100000,
        percentOfTop: 100,
        dropPercent: null,
      },
      { label: "Sign-ups", count: 42000, percentOfTop: 42, dropPercent: -58 },
      {
        label: "Trial started",
        count: 18400,
        percentOfTop: 18.4,
        dropPercent: -56.2,
      },
      {
        label: "Subscribed",
        count: 7200,
        percentOfTop: 7.2,
        dropPercent: -60.9,
      },
      {
        label: "Renewed (M2)",
        count: 4860,
        percentOfTop: 4.9,
        dropPercent: -32.5,
      },
    ],
  },
}
