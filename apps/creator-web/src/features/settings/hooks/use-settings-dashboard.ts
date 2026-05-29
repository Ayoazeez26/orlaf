import { useQuery } from "@tanstack/react-query"
import { fetchSettingsDashboard } from "../api/settings-api"
import { settingsKeys } from "../data/query-keys"

export function useSettingsDashboard() {
  return useQuery({
    queryKey: settingsKeys.dashboard(),
    queryFn: fetchSettingsDashboard,
  })
}
