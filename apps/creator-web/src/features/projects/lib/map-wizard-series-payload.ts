import type { CreateSeriesRequest, UpdateSeriesRequest } from "@sable/contracts"
import type { UploadWizardState } from "../types"

function mapProjectType(type: UploadWizardState["projectType"]) {
  return type === "short-film" ? "short_film" : "short_series"
}

function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function buildSeriesPayload(
  state: UploadWizardState
): CreateSeriesRequest & UpdateSeriesRequest {
  return {
    title: state.title.trim(),
    synopsis: state.synopsis.trim() || undefined,
    type: mapProjectType(state.projectType),
    genres: state.genres,
    language: state.language,
    tags: parseTags(state.tags),
    subtitleLanguages: state.subtitleTracks,
    cast: state.cast
      .filter((person) => person.name.trim())
      .map((person) => ({
        fullName: person.name.trim(),
        stageName: person.role.trim() || undefined,
      })),
    crew: state.crew
      .filter((person) => person.name.trim())
      .map((person) => ({
        fullName: person.name.trim(),
        role: person.role.trim() || "Crew",
      })),
    aiVerticalConversion: state.aiConversionEnabled,
    autoCaptions: state.autoCaptionEnabled,
    posterUrl: state.poster?.remoteUrl,
    trailerUrl: state.trailerUrl ?? undefined,
  }
}
