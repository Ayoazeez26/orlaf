import { Crown, Gift, Lock } from "lucide-react"
import { MOCK_PROJECT_SUMMARIES } from "@/features/projects/data/mock-projects"
import type { DashboardHomeData, DashboardProject } from "../types"

const HOME_PROJECTS: DashboardProject[] = MOCK_PROJECT_SUMMARIES.map(
  (project) => ({
    id: project.id,
    title: project.title,
    episodeCount: project.episodeCount,
    status: project.status,
    thumbnailUrl: project.thumbnailUrl,
  })
)

export const MOCK_DASHBOARD_HOME: DashboardHomeData = {
  user: {
    displayName: "Adeola",
    role: "Creator",
    workspace: {
      id: "lucid",
      name: "Lucid Productions",
      initials: "LP",
      role: "Owner",
    },
  },
  metrics: {
    period: "Last 30 days",
    totalViews: "1.2M",
    totalViewsLabel: "total views",
    breakdown: [
      { label: "Episode Views", value: "405k", color: "bg-amber-400" },
      { label: "Profile Visits", value: "22k", color: "bg-pink-400" },
      { label: "Unique Viewers", value: "201k", color: "bg-sky-400" },
      { label: "Avg. Watch Time", value: "25m", color: "bg-rose-300" },
    ],
  },
  projects: HOME_PROJECTS,
  onboardingProgress: {
    title: "Your first series",
    subtitle: "14% completed, let's go!",
    percent: 14,
  },
  earnMoreCards: [
    {
      id: "memberships",
      title: "Enable Memberships",
      description: "Monthly membership for your biggest fans",
      icon: Crown,
      iconClassName: "text-primary",
      iconBackgroundClassName: "bg-primary/10",
    },
    {
      id: "extras",
      title: "Sell Extras",
      description: "Introducing Extras, the creative way to sell",
      icon: Gift,
      iconClassName: "text-pink-600",
      iconBackgroundClassName: "bg-pink-500/10",
    },
    {
      id: "locked",
      title: "Locked Episodes",
      description: "Publish your best content exclusively",
      icon: Lock,
      iconClassName: "text-violet-600",
      iconBackgroundClassName: "bg-violet-500/10",
    },
  ],
}
