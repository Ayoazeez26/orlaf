import { Outlet } from "@tanstack/react-router"
import { SettingsPageHeader } from "../components/settings-page-header"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSidebar } from "../components/settings-sidebar"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsLayout() {
  const { data, isLoading, isError } = useSettingsDashboard()

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SettingsPageHeader />

      {isLoading && <SettingsPageSkeleton />}

      {isError && (
        <p className="text-destructive text-sm">
          Could not load settings. Please try again.
        </p>
      )}

      {data && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <SettingsSidebar />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  )
}
