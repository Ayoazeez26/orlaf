import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Building2, Pencil, Plus, Trash2 } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { BankAccount } from "../../types"

interface BankAccountsCardProps {
  accounts: BankAccount[]
  title?: string
  description?: string
  addButtonLabel?: string
  className?: string
}

export function BankAccountsCard({
  accounts,
  title = "Bank Accounts",
  description = "Add and manage your bank accounts for payouts",
  addButtonLabel = "Add New Account",
  className,
}: BankAccountsCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6", className)}>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        </div>
        <Button type="button" className="w-full shrink-0 gap-1.5 sm:w-auto">
          <Plus className="size-4" aria-hidden />
          {addButtonLabel}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-payout-account-row-bg p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-payout-accent-muted">
                <Building2
                  className="size-5 text-primary"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-foreground text-sm">
                    {account.bankName} ••••{account.last4}
                  </p>
                  {account.isPrimary && (
                    <Badge className="border-0 bg-primary-gradient pb-1 text-[10px] text-primary-foreground hover:bg-primary">
                      Primary
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {account.holderName}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Edit ${account.bankName}`}
              >
                <Pencil className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Delete ${account.bankName}`}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
