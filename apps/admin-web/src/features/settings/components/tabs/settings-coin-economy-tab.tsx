import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import {
  useAdminCoinBundles,
  useCreateAdminCoinBundle,
  useDeleteAdminCoinBundle,
  useUpdateAdminCoinBundle,
} from "@/features/coin-economy/api/coin-economy-hooks"
import { BundlesTab } from "@/features/coin-economy/components/tabs/bundles-tab"
import { SettingsTab } from "@/features/coin-economy/components/tabs/settings-tab"
import {
  bundleFormToCreateRequest,
  bundleFormToUpdateRequest,
} from "@/features/coin-economy/lib/map-admin-coin-bundle"
import type {
  BundleFormValues,
  CoinBundle,
} from "@/features/coin-economy/types"
import { toast, toastMutationError } from "@/lib/toast"

export function SettingsCoinEconomyTab() {
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editingBundle, setEditingBundle] = useState<CoinBundle | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingBundle, setDeletingBundle] = useState<CoinBundle | undefined>()

  const bundlesQuery = useAdminCoinBundles()
  const createBundle = useCreateAdminCoinBundle()
  const updateBundle = useUpdateAdminCoinBundle()
  const deleteBundle = useDeleteAdminCoinBundle()

  async function handleSaveBundle(values: BundleFormValues) {
    try {
      if (formMode === "edit" && editingBundle) {
        await updateBundle.mutateAsync({
          id: editingBundle.id,
          body: bundleFormToUpdateRequest(values),
        })
        toast.success("Bundle updated")
      } else {
        await createBundle.mutateAsync(bundleFormToCreateRequest(values))
        toast.success("Bundle created")
      }
      setFormOpen(false)
    } catch (error) {
      toastMutationError(error, "Unable to save bundle")
    }
  }

  async function handleConfirmDelete() {
    if (!deletingBundle) return
    try {
      await deleteBundle.mutateAsync(deletingBundle.id)
      toast.success("Bundle deleted")
      setDeleteOpen(false)
      setDeletingBundle(undefined)
    } catch (error) {
      toastMutationError(error, "Unable to delete bundle")
    }
  }

  function handleNewBundle() {
    setFormMode("create")
    setEditingBundle(undefined)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <SettingsTab />

      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={handleNewBundle}>
          <Plus className="size-4" aria-hidden />
          New bundle
        </Button>
      </div>

      <BundlesTab
        bundles={bundlesQuery.data ?? []}
        isLoading={bundlesQuery.isLoading}
        isSaving={createBundle.isPending || updateBundle.isPending}
        isDeleting={deleteBundle.isPending}
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
    </div>
  )
}
