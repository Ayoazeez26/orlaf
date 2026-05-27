import { useQuery } from "@tanstack/react-query"
import { fetchProjects } from "../api/projects-api"
import { projectKeys } from "../data/query-keys"

export function useProjectsList() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  })
}
