import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useMemo, useState } from "react"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useAddDiscoveryRailItem,
  useCreateDiscoveryRail,
  useDeleteDiscoveryRail,
  useDiscoveryRailsQuery,
  useForYouPreviewQuery,
  useRemoveDiscoveryRailItem,
  useReorderDiscoveryRails,
  useUpdateDiscoveryRail,
} from "../api/discovery-hooks"
import { homeRailRoles } from "../lib/rail-roles"
import type { DiscoveryRail, DiscoverySurface, RailContentItem } from "../types"
import { AddContentDialog } from "./add-content-dialog"
import { DiscoveryPageHeader } from "./discovery-page-header"
import { DiscoveryRailCard } from "./discovery-rail-card"
import { DiscoveryStatCards } from "./discovery-stat-cards"
import { DiscoverySurfaceToggle } from "./discovery-surface-toggle"
import { DiscoveryToolbar } from "./discovery-toolbar"
import { ForYouRankingPanel } from "./for-you-ranking-panel"
import { NewRailDialog } from "./new-rail-dialog"

export function DiscoveryPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeSurface, setActiveSurface] = useState<DiscoverySurface>("home")
  const [search, setSearch] = useState("")
  const [newRailOpen, setNewRailOpen] = useState(false)
  const [railToEdit, setRailToEdit] = useState<DiscoveryRail | null>(null)
  const [addContentOpen, setAddContentOpen] = useState(false)
  const [selectedRail, setSelectedRail] = useState<DiscoveryRail | null>(null)
  const [railToDelete, setRailToDelete] = useState<DiscoveryRail | null>(null)
  const [itemToRemove, setItemToRemove] = useState<{
    rail: DiscoveryRail
    item: RailContentItem
  } | null>(null)

  const { data, isLoading } = useDiscoveryRailsQuery()
  const { data: forYouPreview } = useForYouPreviewQuery()
  const createRail = useCreateDiscoveryRail()
  const updateRail = useUpdateDiscoveryRail()
  const deleteRail = useDeleteDiscoveryRail()
  const reorderRails = useReorderDiscoveryRails()
  const addItem = useAddDiscoveryRailItem()
  const removeItem = useRemoveDiscoveryRailItem()

  const rails = data?.rails ?? []
  const roles = useMemo(() => homeRailRoles(rails), [rails])

  const homeRails = useMemo(
    () =>
      rails
        .filter((rail) => rail.surface === "home")
        .sort((a, b) => a.position - b.position),
    [rails]
  )

  const filteredRails = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return homeRails
    return homeRails.filter((rail) => rail.title.toLowerCase().includes(query))
  }, [homeRails, search])

  function handleAddContent(rail: DiscoveryRail) {
    setSelectedRail(rail)
    setAddContentOpen(true)
  }

  function moveRail(rail: DiscoveryRail, direction: "up" | "down") {
    const ids = homeRails.map((item) => item.id)
    const index = ids.indexOf(rail.id)
    const swapWith = direction === "up" ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= ids.length) return
    const next = [...ids]
    const current = next[index]
    const other = next[swapWith]
    if (!current || !other) return
    next[index] = other
    next[swapWith] = current
    void reorderRails.mutateAsync({ surface: "home", railIds: next })
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <DiscoveryPageHeader
        onNewRail={
          activeSurface === "home" ? () => setNewRailOpen(true) : undefined
        }
      />

      <DiscoveryStatCards
        rails={homeRails}
        pinnedCount={
          forYouPreview?.items.filter((item) => item.pin !== null).length
        }
      />

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <DiscoverySurfaceToggle
              active={activeSurface}
              onChange={setActiveSurface}
            />
            <DiscoveryToolbar
              search={search}
              onSearchChange={setSearch}
              placeholder={
                activeSurface === "home"
                  ? "Search rails..."
                  : "Search series..."
              }
            />
          </div>

          {activeSurface === "for-you" ? (
            <ForYouRankingPanel search={search} />
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex min-h-40 items-center justify-center text-muted-foreground text-sm">
                  Loading rails…
                </div>
              ) : filteredRails.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center text-center text-muted-foreground text-sm">
                  {search.trim()
                    ? "No rails match your search."
                    : "No Home rails yet. Featured uses the automatic ranking until you add one."}
                </div>
              ) : (
                filteredRails.map((rail) => {
                  const index = homeRails.indexOf(rail)
                  return (
                    <DiscoveryRailCard
                      key={rail.id}
                      rail={rail}
                      role={roles.get(rail.id)}
                      onAddContent={handleAddContent}
                      onMoveUp={() => moveRail(rail, "up")}
                      onMoveDown={() => moveRail(rail, "down")}
                      canMoveUp={index > 0}
                      canMoveDown={index < homeRails.length - 1}
                      onToggleVisible={() =>
                        void updateRail.mutateAsync({
                          id: rail.id,
                          body: { isVisible: !rail.isVisible },
                        })
                      }
                      onToggleLive={() =>
                        void updateRail.mutateAsync({
                          id: rail.id,
                          body: {
                            status: rail.status === "live" ? "draft" : "live",
                          },
                        })
                      }
                      onDelete={() => setRailToDelete(rail)}
                      onEdit={() => setRailToEdit(rail)}
                      onRemoveItem={(seriesId) => {
                        const item = rail.items.find(
                          (entry) => entry.id === seriesId
                        )
                        if (!item) return
                        setItemToRemove({ rail, item })
                      }}
                    />
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <NewRailDialog
        open={newRailOpen}
        onOpenChange={setNewRailOpen}
        onConfirm={(values) => {
          void createRail.mutateAsync(values)
        }}
      />

      <NewRailDialog
        open={railToEdit !== null}
        onOpenChange={(open) => {
          if (!open) setRailToEdit(null)
        }}
        initialValues={
          railToEdit
            ? {
                title: railToEdit.title,
                type: railToEdit.type,
                status: railToEdit.status,
                audience: railToEdit.audience,
                collectionKey: railToEdit.collectionKey ?? null,
              }
            : undefined
        }
        onConfirm={(values) => {
          if (!railToEdit) return
          void updateRail.mutateAsync({
            id: railToEdit.id,
            body: {
              title: values.title,
              type: values.type,
              status: values.status,
              audience: values.audience,
              collectionKey: values.collectionKey,
            },
          })
        }}
      />

      <AddContentDialog
        open={addContentOpen}
        onOpenChange={setAddContentOpen}
        rail={selectedRail}
        onAddSeries={(seriesId) => {
          if (!selectedRail) return
          void addItem
            .mutateAsync({ railId: selectedRail.id, seriesId })
            .then((updated) => {
              if (updated) setSelectedRail(updated)
            })
        }}
      />

      <ConfirmDeleteDialog
        open={railToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRailToDelete(null)
        }}
        title={`Delete ${railToDelete?.title ?? "rail"}?`}
        description="This rail and its editorial order will be removed. Catalog fallback ranking will be used if this rail overrode a collection."
        confirmLabel="Delete rail"
        isPending={deleteRail.isPending}
        onConfirm={async () => {
          if (!railToDelete) return
          await deleteRail.mutateAsync(railToDelete.id)
          setRailToDelete(null)
        }}
      />

      <ConfirmDeleteDialog
        open={itemToRemove !== null}
        onOpenChange={(open) => {
          if (!open) setItemToRemove(null)
        }}
        title={`Remove ${itemToRemove?.item.title ?? "series"}?`}
        description={`This series will be taken off “${itemToRemove?.rail.title ?? "this rail"}”.`}
        confirmLabel="Remove"
        isPending={removeItem.isPending}
        onConfirm={async () => {
          if (!itemToRemove) return
          await removeItem.mutateAsync({
            railId: itemToRemove.rail.id,
            seriesId: itemToRemove.item.id,
          })
          setItemToRemove(null)
        }}
      />
    </div>
  )
}
