import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { MOCK_RAILS } from "../data/mock-discovery"
import type { DiscoveryRail, DiscoverySurface } from "../types"
import { AddContentDialog } from "./add-content-dialog"
import { DiscoveryPageHeader } from "./discovery-page-header"
import { DiscoveryRailCard } from "./discovery-rail-card"
import { DiscoveryStatCards } from "./discovery-stat-cards"
import { DiscoverySurfaceToggle } from "./discovery-surface-toggle"
import { DiscoveryToolbar } from "./discovery-toolbar"
import { NewRailDialog } from "./new-rail-dialog"

export function DiscoveryPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeSurface, setActiveSurface] = useState<DiscoverySurface>("home")
  const [search, setSearch] = useState("")
  const [newRailOpen, setNewRailOpen] = useState(false)
  const [addContentOpen, setAddContentOpen] = useState(false)
  const [selectedRail, setSelectedRail] = useState<DiscoveryRail | null>(null)

  const filteredRails = useMemo(() => {
    const query = search.trim().toLowerCase()

    return MOCK_RAILS.filter((rail) => {
      if (rail.surface !== activeSurface) return false
      if (!query) return true
      return rail.title.toLowerCase().includes(query)
    }).sort((a, b) => a.position - b.position)
  }, [activeSurface, search])

  function handleAddContent(rail: DiscoveryRail) {
    setSelectedRail(rail)
    setAddContentOpen(true)
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <DiscoveryPageHeader onNewRail={() => setNewRailOpen(true)} />

      <DiscoveryStatCards rails={MOCK_RAILS} />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <DiscoverySurfaceToggle
              active={activeSurface}
              onChange={setActiveSurface}
            />
            <DiscoveryToolbar search={search} onSearchChange={setSearch} />
          </div>

          <div className="space-y-4">
            {filteredRails.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center text-center text-muted-foreground text-sm">
                No rails match your search on this surface.
              </div>
            ) : (
              filteredRails.map((rail) => (
                <DiscoveryRailCard
                  key={rail.id}
                  rail={rail}
                  onAddContent={handleAddContent}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <NewRailDialog
        open={newRailOpen}
        onOpenChange={setNewRailOpen}
        defaultSurface={activeSurface}
      />

      <AddContentDialog
        open={addContentOpen}
        onOpenChange={setAddContentOpen}
        rail={selectedRail}
      />
    </div>
  )
}
