import type { LucideIcon } from "lucide-react"

export type ProjectStatus = "ongoing" | "completed" | "draft"

export interface DashboardWorkspace {
  id: string
  name: string
  initials: string
  role: "Owner" | "Member"
}

export interface DashboardUser {
  displayName: string
  role: string
  workspace: DashboardWorkspace
}

export interface DashboardProject {
  id: string
  title: string
  episodeCount: number
  status: ProjectStatus
  thumbnailUrl?: string
}

export interface DashboardMetricBreakdown {
  label: string
  value: string
  color: string
}

export interface DashboardMetrics {
  period: string
  totalViews: string
  totalViewsLabel: string
  breakdown: DashboardMetricBreakdown[]
}

export interface DashboardOnboardingProgress {
  title: string
  subtitle: string
  percent: number
}

export interface DashboardEarnMoreCard {
  id: string
  title: string
  description: string
  icon: LucideIcon
  iconClassName: string
  iconBackgroundClassName: string
}

export interface DashboardHomeData {
  user: DashboardUser
  metrics: DashboardMetrics
  projects: DashboardProject[]
  onboardingProgress: DashboardOnboardingProgress
  earnMoreCards: DashboardEarnMoreCard[]
}

export interface DashboardNavItem {
  label: string
  to: string
  icon: LucideIcon
}
