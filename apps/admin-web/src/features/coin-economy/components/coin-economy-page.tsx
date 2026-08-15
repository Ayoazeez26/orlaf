import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import {
  useAdminCoinBundles,
  useCreateAdminCoinBundle,
  useDeleteAdminCoinBundle,
  useUpdateAdminCoinBundle,
} from "../api/coin-economy-hooks"
import {
  bundleFormToCreateRequest,
  bundleFormToUpdateRequest,
} from "../lib/map-admin-coin-bundle"
import type { BundleFormValues, CoinBundle, CoinEconomyView } from "../types"
import { CoinEconomyPageHeader } from "./coin-economy-page-header"
import { CoinEconomyStatCards } from "./coin-economy-stat-cards"
import { CoinEconomyViewTabs } from "./coin-economy-view-tabs"
import { AnalyticsTab } from "./tabs/analytics-tab"
import { BundlesTab } from "./tabs/bundles-tab"
import { PurchaseHistoryTab } from "./tabs/purchase-history-tab"
import { SettingsTab } from "./tabs/settings-tab"

export function CoinEconomyPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<CoinEconomyView>("bundles")
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingBundle, setEditingBundle] = useState<CoinBundle | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingBundle, setDeletingBundle] = useState<CoinBundle | undefined>()
  const [actionError, setActionError] = useState<string | null>(null)

  const bundlesQuery = useAdminCoinBundles()
  const createBundle = useCreateAdminCoinBundle()
  const updateBundle = useUpdateAdminCoinBundle()
  const deleteBundle = useDeleteAdminCoinBundle()

  const bundles = bundlesQuery.data ?? []
  const isSaving = createBundle.isPending || updateBundle.isPending
  const isDeleting = deleteBundle.isPending

  function handleNewBundle() {
    setActiveView("bundles")
    setFormMode("create")
    setEditingBundle(undefined)
    setActionError(null)
    setFormOpen(true)
  }

  async function handleSaveBundle(values: BundleFormValues) {
    setActionError(null)
    try {
      if (formMode === "edit" && editingBundle) {
        await updateBundle.mutateAsync({
          id: editingBundle.id,
          body: bundleFormToUpdateRequest(values),
        })
      } else {
        await createBundle.mutateAsync(bundleFormToCreateRequest(values))
      }
      setFormOpen(false)
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to save bundle"
      )
    }
  }

  async function handleConfirmDelete() {
    if (!deletingBundle) return
    setActionError(null)
    try {
      await deleteBundle.mutateAsync(deletingBundle.id)
      setDeleteOpen(false)
      setDeletingBundle(undefined)
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to delete bundle"
      )
    }
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <CoinEconomyPageHeader onNewBundle={handleNewBundle} />
      <CoinEconomyStatCards />
      <CoinEconomyViewTabs active={activeView} onChange={setActiveView} />

      {actionError ? (
        <p className="text-destructive text-sm">{actionError}</p>
      ) : null}

      {activeView === "bundles" ? (
        <BundlesTab
          bundles={bundles}
          isLoading={bundlesQuery.isLoading}
          isSaving={isSaving}
          isDeleting={isDeleting}
          formOpen={formOpen}
          formMode={formMode}
          editingBundle={editingBundle}
          deleteOpen={deleteOpen}
          deletingBundle={deletingBundle}
          onFormOpenChange={setFormOpen}
          onDeleteOpenChange={setDeleteOpen}
          onEdit={(bundle) => {
            setFormMode("edit")
            setEditingBundle(bundle)
            setActionError(null)
            setFormOpen(true)
          }}
          onDelete={(bundle) => {
            setDeletingBundle(bundle)
            setActionError(null)
            setDeleteOpen(true)
          }}
          onSave={handleSaveBundle}
          onConfirmDelete={handleConfirmDelete}
        />
      ) : null}
      {activeView === "analytics" ? <AnalyticsTab /> : null}
      {activeView === "purchase-history" ? <PurchaseHistoryTab /> : null}
      {activeView === "settings" ? <SettingsTab /> : null}
    </div>
  )
}
