import { useEffect, useState } from "react"
import { setOnMaintenanceDetected } from "@/lib/http-client"
import { MaintenancePage } from "./maintenance-page"

/**
 * Wraps the app and swaps the entire tree for a maintenance page the moment
 * any API call reports platform_maintenance_mode (backend's admin-only
 * override) — set once here so it applies regardless of which query/mutation
 * happened to trigger it, rather than being wired into every call site.
 */
export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false)

  useEffect(() => {
    setOnMaintenanceDetected(() => setIsMaintenanceActive(true))
    return () => setOnMaintenanceDetected(null)
  }, [])

  if (isMaintenanceActive) {
    return <MaintenancePage />
  }

  return <>{children}</>
}
