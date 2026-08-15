import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { ProjectDetail } from "../../types"
import { ProjectDetailHeader } from "./project-detail-header"
import { type ProjectDetailTab, ProjectDetailTabs } from "./project-detail-tabs"
import { ProjectReviewView } from "./project-review-view"
import { ProjectAnalyticsTab } from "./tabs/project-analytics-tab"
import { ProjectEpisodesTab } from "./tabs/project-episodes-tab"
import { ProjectModerationTab } from "./tabs/project-moderation-tab"
import { ProjectOverviewTab } from "./tabs/project-overview-tab"

interface ProjectDetailPageProps {
  project: ProjectDetail
  role: WorkspaceRoleId
}

export function ProjectDetailPage({ project, role }: ProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>("overview")
  const isPendingReview = project.reviewStatus === "pending"

  if (isPendingReview) {
    return (
      <div className="space-y-6">
        <ProjectDetailHeader project={project} role={role} variant="review" />
        <ProjectReviewView project={project} role={role} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProjectDetailHeader project={project} role={role} />

      <ProjectDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" ? (
        <ProjectOverviewTab project={project} />
      ) : null}
      {activeTab === "episodes" ? (
        <ProjectEpisodesTab project={project} />
      ) : null}
      {activeTab === "analytics" ? (
        <ProjectAnalyticsTab projectId={project.id} />
      ) : null}
      {activeTab === "moderation" ? (
        <ProjectModerationTab project={project} role={role} />
      ) : null}
    </div>
  )
}
