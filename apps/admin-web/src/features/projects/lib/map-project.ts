import type {
  AdminSeriesDetail,
  AdminSeriesEpisode,
  AdminSeriesListItem,
} from "@sable/contracts"
import type { Project, ProjectDetail } from "../types"

const EMPTY_ANALYTICS: ProjectDetail["analytics"] = {
  totalViews: 0,
  revenue: 0,
  subscribers: 0,
  avgWatchTime: "—",
  viewsThisWeek: [],
  topEpisodes: [],
}

export function mapListItemToProject(item: AdminSeriesListItem): Project {
  return {
    id: item.id,
    title: item.title,
    genre: item.genre,
    language: item.language,
    creatorName: item.creatorName,
    episodeCount: item.episodeCount,
    views: item.views,
    publishStatus: item.publishStatus,
    reviewStatus: item.reviewStatus,
    posterUrl: item.posterUrl,
  }
}

export function mapDetailToProject(detail: AdminSeriesDetail): ProjectDetail {
  return {
    ...mapListItemToProject(detail),
    description: detail.synopsis ?? "",
    created: new Date(detail.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    creatorEmail: detail.creatorEmail,
    creatorUsername: detail.creatorUsername,
    creatorInitials: detail.creatorInitials,
    episodes: detail.episodes.map((episode: AdminSeriesEpisode) => ({
      id: episode.id,
      number: episode.number,
      title: episode.title,
      duration: episode.duration,
      size: episode.size,
      views: episode.views,
      status:
        episode.status === "published"
          ? "published"
          : episode.status === "failed"
            ? "draft"
            : "draft",
    })),
    topEpisodes: [],
    analytics: EMPTY_ANALYTICS,
    moderationReports: [],
  }
}
