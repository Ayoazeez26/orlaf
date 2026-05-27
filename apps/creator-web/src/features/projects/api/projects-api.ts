import {
  MOCK_PROJECT_DETAILS,
  MOCK_PROJECT_SUMMARIES,
} from "../data/mock-projects"
import type { ProjectDetail, ProjectSummary } from "../types"

const MOCK_DELAY_MS = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_DELAY_MS)
  })
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  return delay([...MOCK_PROJECT_SUMMARIES])
}

export async function fetchProject(id: string): Promise<ProjectDetail> {
  const project = MOCK_PROJECT_DETAILS[id]
  if (!project) {
    throw new Error(`Project not found: ${id}`)
  }
  return delay({ ...project })
}

export async function updateProjectSettings(
  id: string,
  patch: Partial<ProjectDetail["visibility"] & ProjectDetail["monetization"]>
): Promise<ProjectDetail> {
  const project = MOCK_PROJECT_DETAILS[id]
  if (!project) {
    throw new Error(`Project not found: ${id}`)
  }
  if (
    patch.public !== undefined ||
    patch.listedInSearch !== undefined ||
    patch.commentsEnabled !== undefined
  ) {
    project.visibility = { ...project.visibility, ...patch }
  }
  if (patch.tippingEnabled !== undefined) {
    project.monetization = {
      ...project.monetization,
      tippingEnabled: patch.tippingEnabled,
    }
  }
  return delay({ ...project })
}
