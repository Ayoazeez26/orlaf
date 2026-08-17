import type { AdminNotificationPreferences } from "@sable/contracts"
import { Input } from "@workspace/ui/components/input"
import { useEffect, useState } from "react"
import {
  useAdminNotificationSettings,
  useUpdateAdminNotificationSettings,
} from "@/features/notifications/api/notifications-hooks"
import {
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

const DEFAULT_ADMIN_PREFERENCES: Required<
  Omit<AdminNotificationPreferences, "alerts_email">
> & { alerts_email: string } = {
  creator_applications_enabled: true,
  content_review_enabled: true,
  thumbnail_flagged_enabled: true,
  payout_completed_enabled: true,
  weekly_digest_enabled: false,
  alerts_email: "",
}

function resolveAdminPreferences(
  prefs?: AdminNotificationPreferences
): typeof DEFAULT_ADMIN_PREFERENCES {
  return {
    creator_applications_enabled:
      prefs?.creator_applications_enabled ??
      DEFAULT_ADMIN_PREFERENCES.creator_applications_enabled,
    content_review_enabled:
      prefs?.content_review_enabled ??
      DEFAULT_ADMIN_PREFERENCES.content_review_enabled,
    thumbnail_flagged_enabled:
      prefs?.thumbnail_flagged_enabled ??
      DEFAULT_ADMIN_PREFERENCES.thumbnail_flagged_enabled,
    payout_completed_enabled:
      prefs?.payout_completed_enabled ??
      DEFAULT_ADMIN_PREFERENCES.payout_completed_enabled,
    weekly_digest_enabled:
      prefs?.weekly_digest_enabled ??
      DEFAULT_ADMIN_PREFERENCES.weekly_digest_enabled,
    alerts_email: prefs?.alerts_email ?? DEFAULT_ADMIN_PREFERENCES.alerts_email,
  }
}

export function SettingsNotificationsTab() {
  const settingsQuery = useAdminNotificationSettings()
  const updateSettings = useUpdateAdminNotificationSettings()
  const [prefs, setPrefs] = useState(DEFAULT_ADMIN_PREFERENCES)

  useEffect(() => {
    if (!settingsQuery.data) return
    setPrefs(resolveAdminPreferences(settingsQuery.data.admin_preferences))
  }, [settingsQuery.data])

  function patchPreferences(patch: Partial<typeof DEFAULT_ADMIN_PREFERENCES>) {
    const next = { ...prefs, ...patch }
    setPrefs(next)
    updateSettings.mutate({
      admin_preferences: {
        creator_applications_enabled: next.creator_applications_enabled,
        content_review_enabled: next.content_review_enabled,
        thumbnail_flagged_enabled: next.thumbnail_flagged_enabled,
        payout_completed_enabled: next.payout_completed_enabled,
        weekly_digest_enabled: next.weekly_digest_enabled,
        alerts_email: next.alerts_email || undefined,
      },
    })
  }

  if (settingsQuery.isLoading) {
    return (
      <SettingsPanel>
        <p className="text-muted-foreground text-sm">
          Loading notification settings…
        </p>
      </SettingsPanel>
    )
  }

  if (settingsQuery.isError) {
    return (
      <SettingsPanel>
        <p className="text-destructive text-sm">
          Could not load notification settings.
        </p>
      </SettingsPanel>
    )
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Admin alerts"
        subtitle="What the team gets pinged about."
      >
        <ToggleField
          label="New creator applications"
          hint=""
          checked={prefs.creator_applications_enabled}
          onCheckedChange={(checked) =>
            patchPreferences({ creator_applications_enabled: checked })
          }
        />
        <ToggleField
          label="Content awaiting review"
          hint=""
          checked={prefs.content_review_enabled}
          onCheckedChange={(checked) =>
            patchPreferences({ content_review_enabled: checked })
          }
        />
        <ToggleField
          label="Thumbnail flagged by auto-moderation"
          hint=""
          checked={prefs.thumbnail_flagged_enabled}
          onCheckedChange={(checked) =>
            patchPreferences({ thumbnail_flagged_enabled: checked })
          }
        />
        <ToggleField
          label="Payout cycle completed"
          hint=""
          checked={prefs.payout_completed_enabled}
          onCheckedChange={(checked) =>
            patchPreferences({ payout_completed_enabled: checked })
          }
        />
        <ToggleField
          label="Weekly platform digest"
          hint=""
          checked={prefs.weekly_digest_enabled}
          onCheckedChange={(checked) =>
            patchPreferences({ weekly_digest_enabled: checked })
          }
        />
        <SettingsField label="Send alerts to">
          <Input
            type="email"
            value={prefs.alerts_email}
            onChange={(event) =>
              setPrefs((current) => ({
                ...current,
                alerts_email: event.target.value,
              }))
            }
            onBlur={() =>
              patchPreferences({ alerts_email: prefs.alerts_email })
            }
            placeholder="admins@sable.tv"
            className="h-9"
          />
        </SettingsField>
      </SettingsSection>
    </SettingsPanel>
  )
}
