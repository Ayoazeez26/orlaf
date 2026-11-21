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
    // Still processing: the server fills trailerUrl when it is ready.
    trailerVideoHostingId: state.trailerUrl
      ? undefined
      : state.trailer?.videoHostingId,
  }
}

/** Title a draft gets when it is created before the creator has named it. */
export const UNTITLED_PROJECT_TITLE = "Untitled project"

/** Payload for creating the draft series as soon as the wizard needs an id. */
export function buildSeriesCreatePayload(
  state: UploadWizardState
): CreateSeriesRequest {
  const payload = buildSeriesPayload(state)
  return { ...payload, title: payload.title || UNTITLED_PROJECT_TITLE }
}

/**
 * Payload for saving the wizard's details onto an existing series. Leaves
 * out the trailer: its upload links itself to the series on the server, and
 * sending the wizard's copy could undo a newer trailer the creator just
 * picked. Leaves out an empty title so a draft keeps its placeholder name.
 */
export function buildSeriesUpdatePayload(
  state: UploadWizardState
): UpdateSeriesRequest {
  const {
    trailerUrl: _trailerUrl,
    trailerVideoHostingId: _trailerVideoHostingId,
    title,
    ...rest
  } = buildSeriesPayload(state)
  return title ? { ...rest, title } : rest
}
