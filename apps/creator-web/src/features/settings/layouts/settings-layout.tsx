import { Outlet } from "@tanstack/react-router"
import { SettingsPageHeader } from "../components/settings-page-header"
import { SettingsSidebar } from "../components/settings-sidebar"

export function SettingsLayout() {
  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <SettingsPageHeader />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
