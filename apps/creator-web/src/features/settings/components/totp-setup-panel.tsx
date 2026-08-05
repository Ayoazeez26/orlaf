import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Check, ChevronDown, Copy } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useState } from "react"

interface TotpSetupPanelProps {
  otpauthUrl: string
  secret: string
  code: string
  onCodeChange: (code: string) => void
}

export function TotpSetupPanel({
  otpauthUrl,
  secret,
  code,
  onCodeChange,
}: TotpSetupPanelProps) {
  const [manualOpen, setManualOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopySecret() {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="font-medium text-foreground text-sm">1. Scan this code</p>
        <p className="text-muted-foreground text-sm">
          Open Google Authenticator, Authy, 1Password, or another authenticator
          app and scan the QR code below.
        </p>
        <div className="flex justify-center">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCodeSVG
              value={otpauthUrl}
              size={192}
              level="M"
              includeMargin={false}
              aria-label="Authenticator setup QR code"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-medium text-foreground text-sm">
          2. Enter the verification code
        </p>
        <p className="text-muted-foreground text-sm">
          Type the 6-digit code shown in your authenticator app to finish setup.
        </p>
        <div className="space-y-2">
          <Label htmlFor="totp-setup-code" className="sr-only">
            Authenticator code
          </Label>
          <Input
            id="totp-setup-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(event) =>
              onCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          aria-expanded={manualOpen}
          onClick={() => setManualOpen((open) => !open)}
        >
          <span className="font-medium text-foreground text-sm">
            Can&apos;t scan the code?
          </span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${manualOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {manualOpen ? (
          <div className="space-y-3 border-border border-t px-4 py-3">
            <p className="text-muted-foreground text-sm">
              Enter this setup key manually in your authenticator app, or open
              the link on a device with an authenticator installed.
            </p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded-lg bg-muted px-3 py-2 font-mono text-xs">
                {secret}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => void handleCopySecret()}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" aria-hidden />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <a
              href={otpauthUrl}
              className="inline-block text-primary text-sm underline"
            >
              Open in authenticator app
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
