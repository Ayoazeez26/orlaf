import { useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { MOCK_COIN_BUNDLES } from "../data/mock-bundles"
import type { BundleFormValues, CoinBundle, CoinEconomyView } from "../types"
import { CoinEconomyPageHeader } from "./coin-economy-page-header"
import { CoinEconomyStatCards } from "./coin-economy-stat-cards"
import { CoinEconomyViewTabs } from "./coin-economy-view-tabs"
import { AnalyticsTab } from "./tabs/analytics-tab"
import { BundlesTab } from "./tabs/bundles-tab"
import { PurchaseHistoryTab } from "./tabs/purchase-history-tab"
import { SettingsTab } from "./tabs/settings-tab"

function formValuesToBundle(
  values: BundleFormValues,
  existing?: CoinBundle
): CoinBundle {
  const totalCoins = values.coins + values.bonusCoins
  const priceNumber =
    Number.parseFloat(values.price.replace(/[^\d.]/g, "")) || 1

  return {
    id: existing?.id ?? `bundle-${Date.now()}`,
    name: values.name,
    coins: values.coins,
    bonusCoins: values.bonusCoins,
    price: values.price,
    effectiveRate: Math.round(totalCoins / priceNumber),
    status: values.isLive ? "live" : "draft",
    isBestValue: existing?.isBestValue,
  }
}

export function CoinEconomyPage({ role: _role }: { role: WorkspaceRoleId }) {
  const [activeView, setActiveView] = useState<CoinEconomyView>("bundles")
  const [bundles, setBundles] = useState(MOCK_COIN_BUNDLES)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingBundle, setEditingBundle] = useState<CoinBundle | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingBundle, setDeletingBundle] = useState<CoinBundle | undefined>()

  function handleNewBundle() {
    setActiveView("bundles")
    setFormMode("create")
    setEditingBundle(undefined)
    setFormOpen(true)
  }

  function handleSaveBundle(values: BundleFormValues) {
    if (formMode === "edit" && editingBundle) {
      setBundles((current) =>
        current.map((bundle) =>
          bundle.id === editingBundle.id
            ? formValuesToBundle(values, editingBundle)
            : bundle
        )
      )
      return
    }

    setBundles((current) => [...current, formValuesToBundle(values)])
  }

  function handleConfirmDelete() {
    if (!deletingBundle) return
    setBundles((current) =>
      current.filter((bundle) => bundle.id !== deletingBundle.id)
    )
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <CoinEconomyPageHeader onNewBundle={handleNewBundle} />
      <CoinEconomyStatCards />
      <CoinEconomyViewTabs active={activeView} onChange={setActiveView} />

      {activeView === "bundles" ? (
        <BundlesTab
          bundles={bundles}
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
            setFormOpen(true)
          }}
          onDelete={(bundle) => {
            setDeletingBundle(bundle)
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
