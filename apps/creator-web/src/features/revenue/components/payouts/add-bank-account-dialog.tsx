import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { SettingsModalShell } from "@/features/settings/components/settings-modal-shell"

interface AddBankAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: {
    bank_name: string
    account_number: string
    holder_name: string
  }) => Promise<void>
  isPending?: boolean
}

export function AddBankAccountDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: AddBankAccountDialogProps) {
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [holderName, setHolderName] = useState("")

  useEffect(() => {
    if (open) {
      setBankName("")
      setAccountNumber("")
      setHolderName("")
    }
  }, [open])

  return (
    <SettingsModalShell
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next)
      }}
      title="Add bank account"
      description="We store only the bank name and last 4 digits. Finance uses this for manual payouts."
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
              !bankName.trim() ||
              accountNumber.length < 8 ||
              !holderName.trim()
            }
            onClick={async () => {
              await onSubmit({
                bank_name: bankName.trim(),
                account_number: accountNumber.trim(),
                holder_name: holderName.trim(),
              })
              onOpenChange(false)
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Add account"
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank name</Label>
          <Input
            id="bank-name"
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
            placeholder="GTBank"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-number">Account number</Label>
          <Input
            id="account-number"
            value={accountNumber}
            onChange={(event) => setAccountNumber(event.target.value)}
            placeholder="0123456789"
            inputMode="numeric"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="holder-name">Account holder name</Label>
          <Input
            id="holder-name"
            value={holderName}
            onChange={(event) => setHolderName(event.target.value)}
            placeholder="Legal name on the account"
          />
        </div>
      </div>
    </SettingsModalShell>
  )
}
