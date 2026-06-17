import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownLeft, Wallet } from "lucide-react"
import { useState } from "react"
import type { WalletSummary } from "../../types"

interface WalletBalanceCardProps {
  wallet: WalletSummary
  className?: string
}

export function WalletBalanceCard({
  wallet,
  className,
}: WalletBalanceCardProps) {
  const [autoPayout, setAutoPayout] = useState(wallet.autoPayoutEnabled)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-wallet-balance-gradient p-6 sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-primary-foreground/80" aria-hidden />
            <span className="font-medium text-primary-foreground/80 text-xs uppercase tracking-wider">
              Wallet Balance
            </span>
          </div>
          <p className="font-bold font-space-grotesk text-4xl text-primary-foreground tracking-tight sm:text-5xl">
            {wallet.balance}
          </p>
          <p className="text-primary-foreground/80 text-sm">
            {wallet.statusText} • Next auto-payout {wallet.nextAutoPayout}
          </p>
        </div>

        <div className="flex gap-4 sm:items-end">
          <Button
            type="button"
            variant="secondary"
            className="gap-2 self-start bg-background text-primary hover:bg-background/90 sm:self-end"
          >
            <ArrowDownLeft className="size-4" aria-hidden />
            Withdraw to bank
          </Button>
          <div className="flex items-center gap-3 rounded-[16px] bg-[#FFFFFF26] px-4 py-2.5">
            <Switch
              id="auto-payout"
              checked={autoPayout}
              onCheckedChange={setAutoPayout}
              className="data-checked:bg-background data-unchecked:bg-primary-foreground/30"
            />
            <Label
              htmlFor="auto-payout"
              className="font-medium text-primary-foreground text-sm"
            >
              Auto-payout
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
