import { Input } from "@workspace/ui/components/input"
import { useState } from "react"
import {
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsNotificationsTab() {
  const [newApplications, setNewApplications] = useState(true)
  const [contentReview, setContentReview] = useState(true)
  const [thumbnailFlagged, setThumbnailFlagged] = useState(true)
  const [payoutCompleted, setPayoutCompleted] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [alertsEmail, setAlertsEmail] = useState("admins@sable.tv")

  return (
    <SettingsPanel>
      <SettingsSection
        title="Admin alerts"
        subtitle="What the team gets pinged about."
      >
        <ToggleField
          label="New creator applications"
          hint=""
          checked={newApplications}
          onCheckedChange={setNewApplications}
        />
        <ToggleField
          label="Content awaiting review"
          hint=""
          checked={contentReview}
          onCheckedChange={setContentReview}
        />
        <ToggleField
          label="Thumbnail flagged by auto-moderation"
          hint=""
          checked={thumbnailFlagged}
          onCheckedChange={setThumbnailFlagged}
        />
        <ToggleField
          label="Payout cycle completed"
          hint=""
          checked={payoutCompleted}
          onCheckedChange={setPayoutCompleted}
        />
        <ToggleField
          label="Weekly platform digest"
          hint=""
          checked={weeklyDigest}
          onCheckedChange={setWeeklyDigest}
        />
        <SettingsField label="Send alerts to">
          <Input
            type="email"
            value={alertsEmail}
            onChange={(event) => setAlertsEmail(event.target.value)}
            className="h-9"
          />
        </SettingsField>
      </SettingsSection>
    </SettingsPanel>
  )
}
