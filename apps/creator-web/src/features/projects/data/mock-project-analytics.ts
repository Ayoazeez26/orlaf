import type { ProjectAnalytics } from "../types"

export const MOCK_PROJECT_ANALYTICS: ProjectAnalytics = {
  kpis: [
    {
      label: "Total Views",
      value: "24.3k views",
      changePercent: 12.4,
      icon: "views",
    },
    {
      label: "Unique Viewers",
      value: "184K",
      changePercent: 8.1,
      icon: "viewers",
    },
    {
      label: "Avg Watch Time",
      value: "3:42",
      footnote: "+0:18 vs last period",
      icon: "watchTime",
    },
    {
      label: "Completion Rate",
      value: "38%",
      changePercent: -1.2,
      icon: "completion",
    },
  ],
  engagementKpis: [
    {
      label: "Likes",
      value: "8.4K",
      footnote: "+312 vs last period",
      icon: "likes",
    },
    {
      label: "Shares",
      value: "1.2K",
      footnote: "+48 vs last period",
      icon: "shares",
    },
    {
      label: "Subscribers Gained",
      value: "612",
      changePercent: 12,
      icon: "subscribers",
    },
  ],
  viewershipTrend: [
    { month: "Jan", views: 1200, unique: 800 },
    { month: "Feb", views: 1500, unique: 950 },
    { month: "Mar", views: 1800, unique: 1100 },
    { month: "Apr", views: 2100, unique: 1400 },
    { month: "May", views: 2400, unique: 1600 },
    { month: "Jun", views: 2700, unique: 1850 },
    { month: "Jul", views: 3000, unique: 2100 },
  ],
  devices: [
    { name: "Mobile", value: 58, percent: 58 },
    { name: "Desktop", value: 28, percent: 28 },
    { name: "Tablet", value: 14, percent: 14 },
  ],
  audienceRetention: [
    { label: "0%", retention: 100 },
    { label: "10%", retention: 88 },
    { label: "25%", retention: 78 },
    { label: "50%", retention: 67 },
    { label: "75%", retention: 52 },
    { label: "100%", retention: 38 },
  ],
  trafficSources: [
    { name: "For You feed", percent: 42 },
    { name: "Search", percent: 24 },
    { name: "Channel page", percent: 18 },
    { name: "External", percent: 16 },
  ],
}
