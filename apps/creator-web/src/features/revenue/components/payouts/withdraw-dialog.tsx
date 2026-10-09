import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { SettingsModalShell } from "@/features/settings/components/settings-modal-shell"
import type { BankAccount, WalletSummary } from "../../types"

function formatMinor(amountMinor: number, currency: string): string {
  const major = amountMinor / 100
  if (currency === "NGN") {
    return `₦${major.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `₦${major.toFixed(2)}`
}

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: WalletSummary
  bankAccounts: BankAccount[]
  onSubmit: (amountMinor: number) => Promise<void>
  isPending?: boolean
}

export function WithdrawDialog({
  open,
  onOpenChange,
  wallet,
  bankAccounts,
  onSubmit,
  isPending = false,
}: WithdrawDialogProps) {
  const [amountMajor, setAmountMajor] = useState("")

  useEffect(() => {
    if (open) {
      setAmountMajor(String(wallet.availableMinor / 100))
    }
  }, [open, wallet.availableMinor])

  const primaryAccount =
    bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0]
  const parsedMinor = Math.round(Number.parseFloat(amountMajor || "0") * 100)
  const belowMinimum = parsedMinor < wallet.minimumPayoutMinor
  const aboveAvailable = parsedMinor > wallet.availableMinor

  return (
    <SettingsModalShell
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next)
      }}
      title="Withdraw to bank"
      description="Submit a payout request. Our team reviews and disburses manually."
      footer={
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              isPending ||
              !primaryAccount ||
              !Number.isFinite(parsedMinor) ||
              parsedMinor <= 0 ||
              belowMinimum ||
              aboveAvailable
            }
            onClick={async () => {
              await onSubmit(parsedMinor)
              onOpenChange(false)
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Submitting…
              </>
            ) : (
              "Request payout"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <p className="text-muted-foreground">Available</p>
          <p className="font-semibold text-foreground text-lg">
            {wallet.balance}
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Minimum {formatMinor(wallet.minimumPayoutMinor, wallet.currency)}
          </p>
        </div>

        {primaryAccount ? (
          <p className="text-muted-foreground text-sm">
            Payout to {primaryAccount.bankName} ••••{primaryAccount.last4} (
            {primaryAccount.holderName})
          </p>
        ) : (
          <p className="text-destructive text-sm">
            Add a bank account before requesting a withdrawal.
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Amount ({wallet.currency})</Label>
          <Input
            id="withdraw-amount"
            type="number"
            min={wallet.minimumPayoutMinor / 100}
            step="0.01"
            value={amountMajor}
            onChange={(event) => setAmountMajor(event.target.value)}
          />
          {belowMinimum ? (
            <p className="text-destructive text-xs">
              Minimum withdrawal is{" "}
              {formatMinor(wallet.minimumPayoutMinor, wallet.currency)}.
            </p>
          ) : null}
          {aboveAvailable ? (
            <p className="text-destructive text-xs">
              Amount exceeds your available balance.
            </p>
          ) : null}
        </div>
      </div>
    </SettingsModalShell>
  )
}
