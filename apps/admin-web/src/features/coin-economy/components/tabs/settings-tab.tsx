import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { Coins, Upload } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import { DEFAULT_COIN_SETTINGS } from "../../data/coin-analytics"
import type { CoinEconomySettings } from "../../types"

interface SettingsFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
}

function SettingsField({ label, hint, children }: SettingsFieldProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,220px)] sm:items-center sm:gap-6">
      <div>
        <Label className="font-medium text-foreground text-sm">{label}</Label>
        {hint ? (
          <p className="mt-0.5 text-muted-foreground text-xs">{hint}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SettingsSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="font-semibold text-base text-foreground tracking-tight">
          {title}
        </h3>
        <p className="mt-0.5 text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export function SettingsTab() {
  const [settings, setSettings] = useState<CoinEconomySettings>(
    DEFAULT_COIN_SETTINGS
  )

  function update(patch: Partial<CoinEconomySettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-8 px-4 sm:px-6">
        <SettingsSection
          title="Coin basics"
          subtitle="The in-app currency viewers earn and spend."
        >
          <SettingsField
            label="Coin name"
            hint="Shown across the main app (e.g. Sparks, Gems)."
          >
            <Input
              type="text"
              value={settings.coinName}
              onChange={(event) => update({ coinName: event.target.value })}
              className="h-9"
            />
          </SettingsField>

          <SettingsField label="Coin icon">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Coins className="size-5 text-primary" aria-hidden />
              </span>
              <Button type="button" variant="outline" className="gap-2">
                <Upload className="size-4" aria-hidden />
                Upload icon
              </Button>
            </div>
          </SettingsField>

          <SettingsField
            label="Base conversion rate"
            hint="How many coins equal 1 unit of local currency."
          >
            <Input
              type="text"
              value={settings.baseConversionRate}
              onChange={(event) =>
                update({ baseConversionRate: event.target.value })
              }
              className="h-9"
            />
          </SettingsField>

          <SettingsField
            label="Allow coin gifting to creators"
            hint="Viewers can send coins to each other inside the app."
          >
            <Switch
              checked={settings.allowCoinGifting}
              onCheckedChange={(checked) =>
                update({ allowCoinGifting: checked })
              }
              aria-label="Allow coin gifting to creators"
            />
          </SettingsField>

          <SettingsField
            label="Coins expire after 12 months of inactivity"
            hint="Balances reset for viewers who don't open the app for a year."
          >
            <Switch
              checked={settings.coinsExpireAfterInactivity}
              onCheckedChange={(checked) =>
                update({ coinsExpireAfterInactivity: checked })
              }
              aria-label="Coins expire after 12 months of inactivity"
            />
          </SettingsField>
        </SettingsSection>
      </CardContent>
    </Card>
  )
}
