import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { BundleFormValues, CoinBundle } from "../../types"
import { BundleDeleteDialog } from "../bundle-delete-dialog"
import { BundleFormDialog } from "../bundle-form-dialog"
import { BundlesTable } from "../bundles-table"

interface BundlesTabProps {
  bundles: CoinBundle[]
  formOpen: boolean
  formMode: "create" | "edit"
  editingBundle?: CoinBundle
  deleteOpen: boolean
  deletingBundle?: CoinBundle
  onFormOpenChange: (open: boolean) => void
  onDeleteOpenChange: (open: boolean) => void
  onEdit: (bundle: CoinBundle) => void
  onDelete: (bundle: CoinBundle) => void
  onSave: (values: BundleFormValues) => void
  onConfirmDelete: () => void
}

export function BundlesTab({
  bundles,
  formOpen,
  formMode,
  editingBundle,
  deleteOpen,
  deletingBundle,
  onFormOpenChange,
  onDeleteOpenChange,
  onEdit,
  onDelete,
  onSave,
  onConfirmDelete,
}: BundlesTabProps) {
  return (
    <>
      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="flex flex-col gap-5 px-4 sm:px-6">
          <div>
            <h2 className="font-semibold text-base text-foreground">
              Coin Bundles
            </h2>
            <p className="mt-0.5 text-muted-foreground text-sm">
              Bundles users can purchase from the store.
            </p>
          </div>
          <BundlesTable bundles={bundles} onEdit={onEdit} onDelete={onDelete} />
        </CardContent>
      </Card>

      <BundleFormDialog
        open={formOpen}
        onOpenChange={onFormOpenChange}
        mode={formMode}
        initialValues={
          editingBundle
            ? {
                name: editingBundle.name,
                coins: editingBundle.coins,
                bonusCoins: editingBundle.bonusCoins,
                price: editingBundle.price,
                isLive: editingBundle.status === "live",
              }
            : undefined
        }
        onSave={onSave}
      />

      <BundleDeleteDialog
        open={deleteOpen}
        onOpenChange={onDeleteOpenChange}
        bundleName={deletingBundle?.name ?? "this"}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
