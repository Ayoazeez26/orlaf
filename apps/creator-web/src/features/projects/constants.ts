export const PROJECT_IMAGE_BASE = "/images/projects"

export const PROJECT_THUMBNAILS = {
  zuluDawn: `${PROJECT_IMAGE_BASE}/zulu-dawn.webp`,
  palmwineDays: `${PROJECT_IMAGE_BASE}/palmwine-days.webp`,
  jollofWars: `${PROJECT_IMAGE_BASE}/jollof-wars.webp`,
  theReturnees: `${PROJECT_IMAGE_BASE}/the-returnees.webp`,
} as const

export const GENRE_OPTIONS = [
  "Romance / Drama",
  "Action / Adventure",
  "Comedy",
  "Thriller",
  "Documentary",
] as const

export const PROJECT_STATUS_FILTER_OPTIONS = [
  { value: "published" as const, label: "Published" },
  { value: "in_review" as const, label: "In review" },
  { value: "draft" as const, label: "Draft" },
  { value: "scheduled" as const, label: "Scheduled" },
  { value: "ongoing" as const, label: "Ongoing" },
  { value: "completed" as const, label: "Completed" },
]

export const PROJECT_STATUS_FILTER_PILLS = [
  { value: "all" as const, label: "All" },
  { value: "published" as const, label: "Published" },
  { value: "in_review" as const, label: "In review" },
  { value: "draft" as const, label: "Draft" },
  { value: "scheduled" as const, label: "Scheduled" },
]

export const PROJECT_SORT_OPTIONS = [
  { value: "newest" as const, label: "Newest first" },
  { value: "title-asc" as const, label: "Title (A–Z)" },
] as const

export const ALL_GENRES_LABEL = "All genres"

export const LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
  "Swahili",
  "French",
  "Spanish",
  "Portuguese",
  "Arabic",
] as const

export const SERIES_INFO_GENRE_OPTIONS = [
  "Drama",
  "Romance",
  "Comedy",
  "Thriller",
  "Documentary",
  "Anthology",
  "Sci-Fi",
  "Horror",
  "Music",
  "Action",
] as const

export const SUBTITLE_TRACK_OPTIONS = [
  "English",
  "Swahili",
  "French",
  "Spanish",
  "Portuguese",
  "Arabic",
] as const

export const UPLOAD_SERIES_TIPS = [
  "Posters perform best with a clear central subject.",
  "Add a trailer to boost discovery in the For You feed.",
  "Coin-gated content earns 70% revenue share.",
] as const

export function projectDetailPath(projectId: string, tab?: string) {
  const base = {
    to: "/dashboard/projects/$projectId" as const,
    params: { projectId },
  }

  if (tab === "episodes") {
    return {
      to: "/dashboard/projects/$projectId/episodes" as const,
      params: { projectId },
    }
  }
  if (tab === "analytics") {
    return {
      to: "/dashboard/projects/$projectId/analytics" as const,
      params: { projectId },
    }
  }
  if (tab === "settings") {
    return {
      to: "/dashboard/projects/$projectId/settings" as const,
      params: { projectId },
    }
  }

  return base
}

export const UPLOAD_WIZARD_STEPS = [
  { id: "info" as const, label: "Series Info", number: 1 },
  { id: "episodes" as const, label: "Episodes", number: 2 },
  { id: "review" as const, label: "Review", number: 3 },
]
