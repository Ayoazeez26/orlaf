import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { Bell, Mail, Smartphone } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"
import type { NotificationGroup } from "../types"

const ICON_MAP = {
  mail: Mail,
  phone: Smartphone,
  bell: Bell,
} as const

export function SettingsNotificationsPage() {
  const { data } = useSettingsDashboard()
  const [groups, setGroups] = useState(data?.notifications ?? [])

  if (!data) return null

  function toggle(groupId: string, itemId: string, enabled: boolean) {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, enabled } : item
              ),
            }
          : group
      )
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      {groups.map((group) => (
        <NotificationGroupCard
          key={group.id}
          group={group}
          onToggle={(itemId, enabled) => toggle(group.id, itemId, enabled)}
        />
      ))}
    </div>
  )
}

function NotificationGroupCard({
  group,
  onToggle,
}: {
  group: NotificationGroup
  onToggle: (itemId: string, enabled: boolean) => void
}) {
  return (
    <Card className={FROSTED_CARD_SURFACE_CLASS}>
      <CardHeader>
        <p className="font-semibold text-foreground">{group.title}</p>
        {group.description ? (
          <p className="text-muted-foreground text-sm">{group.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {group.items.map((item) => {
          const Icon = item.icon ? ICON_MAP[item.icon] : null
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                {Icon ? (
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" aria-hidden />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-foreground text-sm">{item.label}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={item.enabled}
                onCheckedChange={(v) => onToggle(item.id, v)}
                aria-label={item.label}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
