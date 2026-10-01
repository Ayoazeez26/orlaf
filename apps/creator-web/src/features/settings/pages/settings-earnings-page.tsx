import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { AddBankAccountDialog } from "@/features/revenue/components/payouts/add-bank-account-dialog"
import {
  useCreatePayoutAccount,
  useDeletePayoutAccount,
  useRevenueDashboard,
} from "@/features/revenue/hooks/use-revenue-dashboard"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { SettingsSectionCard } from "../components/settings-section-card"
import type { PayoutMethod } from "../types"

function formatMinor(amountMinor: number, currency: string): string {
  const major = amountMinor / 100
  if (currency === "NGN") {
    return `₦${major.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
  return `$${major.toFixed(2)}`
}

export function SettingsEarningsPage() {
  const { data } = useRevenueDashboard()
  const createAccount = useCreatePayoutAccount()
  const deleteAccount = useDeletePayoutAccount()
  const [addOpen, setAddOpen] = useState(false)
  const [methodToDelete, setMethodToDelete] = useState<PayoutMethod | null>(
    null
  )

  if (!data) return null

  const wallet = data.wallet
  const methods: PayoutMethod[] = data.bankAccounts.map((account) => ({
    id: account.id,
    name: account.bankName,
    details: `••••${account.last4} · ${account.holderName}`,
    badges: account.isPrimary ? ["PRIMARY"] : [],
    isPrimary: account.isPrimary,
  }))

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Wallet"
        description="Live balance from coin unlocks and gifts (after revenue split and hold period)."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Available" value={wallet.balance} large />
          <StatCard
            label="Pending (hold)"
            value={formatMinor(wallet.pendingMinor, wallet.currency)}
          />
          <StatCard
            label="Minimum payout"
            value={formatMinor(wallet.minimumPayoutMinor, wallet.currency)}
          />
        </div>

        <p className="mt-4 text-muted-foreground text-sm">
          Request withdrawals from the Revenue → Overview tab. Auto-payout is
          not enabled yet.
        </p>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Payout method"
        description="Bank accounts used for manual payouts."
        headerAction={
          <Button
            type="button"
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-3.5" aria-hidden />
            Add payout method
          </Button>
        }
      >
        <div className="divide-y rounded-xl border border-border">
          {methods.length === 0 ? (
            <p className="px-4 py-6 text-muted-foreground text-sm">
              No payout methods yet.
            </p>
          ) : (
            methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between gap-3 px-4 py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground text-sm">
                      {method.name}
                    </p>
                    {method.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="border-transparent bg-emerald-500/15 text-emerald-600 text-xs"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {method.details}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label={`Delete ${method.name}`}
                  onClick={() => setMethodToDelete(method)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </div>
            ))
          )}
        </div>
      </SettingsSectionCard>

      <AddBankAccountDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        isPending={createAccount.isPending}
        onSubmit={async (values) => {
          await createAccount.mutateAsync(values)
        }}
      />

      <ConfirmDeleteDialog
        open={methodToDelete != null}
        onOpenChange={(open) => {
          if (!open) setMethodToDelete(null)
        }}
        title="Delete payout method?"
        description={
          methodToDelete
            ? `Remove ${methodToDelete.name} (${methodToDelete.details}) from this studio?`
            : ""
        }
        isPending={deleteAccount.isPending}
        onConfirm={async () => {
          if (!methodToDelete) return
          await deleteAccount.mutateAsync(methodToDelete.id)
          setMethodToDelete(null)
        }}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  large = false,
}: {
  label: string
  value: string
  large?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p
        className={
          large
            ? "mt-1 font-semibold text-2xl text-foreground"
            : "mt-1 font-semibold text-foreground text-lg"
        }
      >
        {value}
      </p>
    </div>
  )
}
