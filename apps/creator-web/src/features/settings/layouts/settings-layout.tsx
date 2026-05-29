import { Outlet } from "@tanstack/react-router"
import { SettingsPageHeader } from "../components/settings-page-header"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsTabNav } from "../components/settings-tab-nav"
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
        <>
          <SettingsTabNav />
          <Outlet />
        </>
      )}
    </div>
  )
}
