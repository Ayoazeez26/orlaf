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

export const LANGUAGE_OPTIONS = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
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
