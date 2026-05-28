import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import type { RevenueNotificationSetting } from "../../types"

interface RevenueNotificationsSectionProps {
  settings: RevenueNotificationSetting[]
  className?: string
}

export function RevenueNotificationsSection({
  settings: initialSettings,
  className,
}: RevenueNotificationsSectionProps) {
  const [settings, setSettings] = useState(initialSettings)

  function toggle(id: string, enabled: boolean) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-6", className)}>
      <CardHeader className="pb-4">
        <p className="font-semibold text-foreground">Revenue &amp; Payouts</p>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-foreground">{setting.label}</p>
              <p className="text-muted-foreground text-sm">
                {setting.description}
              </p>
            </div>
            <Switch
              checked={setting.enabled}
              onCheckedChange={(v) => toggle(setting.id, v)}
              aria-label={setting.label}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
