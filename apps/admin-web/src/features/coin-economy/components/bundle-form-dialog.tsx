import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { BundleFormValues } from "../types"
import { useModalShell } from "./use-modal-shell"

interface BundleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialValues?: BundleFormValues
  onSave: (values: BundleFormValues) => void
}

const EMPTY_VALUES: BundleFormValues = {
  name: "",
  coins: 100,
  bonusCoins: 0,
  price: "₦500",
  isLive: true,
}

export function BundleFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSave,
}: BundleFormDialogProps) {
  const [values, setValues] = useState<BundleFormValues>(EMPTY_VALUES)

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? EMPTY_VALUES)
    }
  }, [open, initialValues])

  useModalShell(open, onOpenChange)

  if (!open) return null

  function update(patch: Partial<BundleFormValues>) {
    setValues((current) => ({ ...current, ...patch }))
  }

  function handleSave() {
    onSave(values)
    onOpenChange(false)
  }

  const title = mode === "create" ? "New Coin Bundle" : "Edit Coin Bundle"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bundle-form-title"
        className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="bundle-form-title"
                className="font-semibold text-foreground text-lg"
              >
                {title}
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Set what viewers get and what they pay.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="bundle-name">Bundle name</Label>
            <Input
              id="bundle-name"
              value={values.name}
              onChange={(event) => update({ name: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bundle-coins">Coins</Label>
            <Input
              id="bundle-coins"
              type="number"
              min={0}
              value={values.coins}
              onChange={(event) =>
                update({ coins: Number(event.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bundle-bonus">Bonus coins</Label>
            <Input
              id="bundle-bonus"
              type="number"
              min={0}
              value={values.bonusCoins}
              onChange={(event) =>
                update({ bonusCoins: Number(event.target.value) })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bundle-price">Price</Label>
            <Input
              id="bundle-price"
              value={values.price}
              onChange={(event) => update({ price: event.target.value })}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="font-medium text-foreground text-sm">
                Make bundle live
              </p>
            </div>
            <Switch
              checked={values.isLive}
              onCheckedChange={(checked) => update({ isLive: checked })}
              aria-label="Make bundle live"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-border border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save bundle
          </Button>
        </div>
      </div>
    </div>
  )
}
