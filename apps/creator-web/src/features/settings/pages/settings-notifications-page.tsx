import { Switch } from "@workspace/ui/components/switch"
import { Bell, Mail, Smartphone } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "../hooks/use-notification-settings"
import { useProfile } from "../hooks/use-profile"
import {
  groupsToNotificationSettingsPatch,
  notificationSettingsToGroups,
} from "../lib/map-notification-settings"
import {
  registerSettingsReset,
  registerSettingsSave,
} from "../lib/settings-form-actions"
import type { NotificationGroup } from "../types"

const ICON_MAP = {
  mail: Mail,
  phone: Smartphone,
  bell: Bell,
} as const

export function SettingsNotificationsPage() {
  const { data: profile } = useProfile()
  const { data, isLoading, isError } = useNotificationSettings()
  const updateSettings = useUpdateNotificationSettings()
  const isStudioCreator = profile?.creatorProfile?.creatorType === "studio"
  const initialGroupsRef = useRef<NotificationGroup[] | null>(null)
  const [groups, setGroups] = useState<NotificationGroup[] | null>(null)

  useEffect(() => {
    if (!data) return
    const initial = notificationSettingsToGroups(data, isStudioCreator)
    initialGroupsRef.current = initial
    setGroups(initial)
  }, [data, isStudioCreator])

  useEffect(() => {
    if (!groups) return

    function handleSave() {
      updateSettings.mutate(
        groupsToNotificationSettingsPatch(groups, isStudioCreator),
        {
          onSuccess: (saved) => {
            const next = notificationSettingsToGroups(saved, isStudioCreator)
            initialGroupsRef.current = next
            setGroups(next)
          },
        }
      )
    }

    function handleReset() {
      if (initialGroupsRef.current) {
        setGroups(initialGroupsRef.current)
      }
    }

    const unregisterSave = registerSettingsSave(handleSave)
    const unregisterReset = registerSettingsReset(handleReset)
    return () => {
      unregisterSave()
      unregisterReset()
    }
  }, [groups, isStudioCreator, updateSettings])

  if (isLoading || !groups) {
    return <SettingsPageSkeleton />
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        Could not load notification settings. Please try again.
      </p>
    )
  }

  function toggle(groupId: string, itemId: string, enabled: boolean) {
    setGroups((prev) =>
      prev
        ? prev.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  items: group.items.map((item) =>
                    item.id === itemId ? { ...item, enabled } : item
                  ),
                }
              : group
          )
        : prev
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <NotificationGroupCard
          key={group.id}
          group={group}
          onToggle={(itemId, enabled) => toggle(group.id, itemId, enabled)}
        />
      ))}

      {updateSettings.isError && (
        <p className="text-destructive text-sm">
          {updateSettings.error instanceof Error
            ? updateSettings.error.message
            : "Failed to save notification settings"}
        </p>
      )}
      {updateSettings.isSuccess && !updateSettings.isPending ? (
        <p className="text-muted-foreground text-sm">Saved</p>
      ) : null}
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
    <SettingsSectionCard title={group.title} description={group.description}>
      <div className="space-y-4">
        {group.items.map((item) => {
          const Icon = item.icon ? ICON_MAP[item.icon] : null
          const disabled = item.disabled === true
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
                  <p className="font-medium text-foreground text-sm">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={item.enabled}
                disabled={disabled}
                onCheckedChange={(value) => {
                  if (!disabled) onToggle(item.id, value)
                }}
                aria-label={item.label}
              />
            </div>
          )
        })}
      </div>
    </SettingsSectionCard>
  )
}
