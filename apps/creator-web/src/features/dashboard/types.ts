import type { LucideIcon } from "lucide-react"
import type { AnalyticsKpi, TopEpisodeRow } from "@/features/analytics/types"

export type DashboardProjectStatus = "published" | "draft" | "in_review"

export type DashboardProjectIconVariant = "purple" | "pink" | "blue"

export interface DashboardUser {
  displayName: string
  fullName: string
  role: string
  initials: string
}

export interface DashboardWorkspace {
  id: string
  name: string
  initials: string
  role: "Owner" | "Member"
}

export interface DashboardProject {
  id: string
  title: string
  type: string
  genre: string
  episodeCount?: number
  duration?: string
  updatedAt: string
  views?: string
  status: DashboardProjectStatus
  iconVariant: DashboardProjectIconVariant
}

export interface DashboardEngagementPoint {
  day: string
  primary: number
  secondary: number
  tertiary: number
}

export interface DashboardNavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface DashboardNavGroup {
  label: string
  items: DashboardNavItem[]
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
  kpis: AnalyticsKpi[]
  engagementChart: DashboardEngagementPoint[]
  topEpisodes: TopEpisodeRow[]
}
