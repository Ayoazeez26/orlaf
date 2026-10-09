import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useNotificationSettingsQuery,
  useUpdateNotificationSettings,
} from "../../api/notification-settings-hooks"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsNotificationsTab() {
  const { data, isLoading } = useNotificationSettingsQuery()
  const updateSettings = useUpdateNotificationSettings()

  const [creatorApplications, setCreatorApplications] = useState(true)
  const [contentReview, setContentReview] = useState(true)
  const [thumbnailFlagged, setThumbnailFlagged] = useState(true)
  const [payoutCompleted, setPayoutCompleted] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [alertsEmail, setAlertsEmail] = useState("")

  useEffect(() => {
    if (!data) return
    setCreatorApplications(data.adminAlertCreatorApplications)
    setContentReview(data.adminAlertContentReview)
    setThumbnailFlagged(data.adminAlertThumbnailFlagged)
    setPayoutCompleted(data.adminAlertPayoutCompleted)
    setWeeklyDigest(data.adminAlertWeeklyDigest)
    setAlertsEmail(data.adminAlertsEmail)
  }, [data])

  const handleSave = useCallback(() => {
    updateSettings.mutate(
      {
        adminAlertCreatorApplications: creatorApplications,
        adminAlertContentReview: contentReview,
        adminAlertThumbnailFlagged: thumbnailFlagged,
        adminAlertPayoutCompleted: payoutCompleted,
        adminAlertWeeklyDigest: weeklyDigest,
        adminAlertsEmail: alertsEmail,
      },
      {
        onSuccess: () => toast.success("Notification settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save notification settings"),
      }
    )
  }, [
    creatorApplications,
    contentReview,
    thumbnailFlagged,
    payoutCompleted,
    weeklyDigest,
    alertsEmail,
    updateSettings,
  ])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  if (isLoading) {
    return (
      <SettingsPanel>
        <p className="text-muted-foreground text-sm">
          Loading notification settings…
        </p>
      </SettingsPanel>
    )
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Admin alerts"
        subtitle="Platform-wide — shared by every admin, not a personal preference. Each admin still gets their own inbox entry; the email below is sent once per alert."
      >
        <ToggleField
          label="New creator applications"
          checked={creatorApplications}
          onCheckedChange={setCreatorApplications}
        />
        <ToggleField
          label="Content awaiting review"
          checked={contentReview}
          onCheckedChange={setContentReview}
        />
        <ToggleField
          label="Thumbnail flagged by auto-moderation"
          checked={thumbnailFlagged}
          onCheckedChange={setThumbnailFlagged}
        />
        <ToggleField
          label="Payout cycle completed"
          checked={payoutCompleted}
          onCheckedChange={setPayoutCompleted}
        />
        <ToggleField
          label="Weekly platform digest"
          hint="Not wired to anything yet — no digest job exists in the product."
          checked={weeklyDigest}
          onCheckedChange={setWeeklyDigest}
        />
        <SettingsField
          label="Send alerts to"
          hint="Leave blank to only show alerts in the admin notifications page."
        >
          <Input
            type="email"
            value={alertsEmail}
            onChange={(event) => setAlertsEmail(event.target.value)}
            placeholder="admins@sable.tv"
            disabled={isLoading}
            className="h-9"
          />
        </SettingsField>
      </SettingsSection>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isLoading || updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </SettingsPanel>
  )
}
