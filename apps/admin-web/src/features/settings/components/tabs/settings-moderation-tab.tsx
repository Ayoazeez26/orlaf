import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { useState } from "react"
import { REVIEW_MODE_OPTIONS, SUSPENSION_LENGTH_OPTIONS } from "../../constants"
import { DEFAULT_COMMUNITY_GUIDELINES } from "../../data/mock-settings"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsModerationTab() {
  const [reviewMode, setReviewMode] = useState("Manual review before publish")
  const [thumbnailApproval, setThumbnailApproval] = useState(true)
  const [autoFlagAdult, setAutoFlagAdult] = useState(true)
  const [strikesBeforeSuspend, setStrikesBeforeSuspend] = useState("3")
  const [suspensionLength, setSuspensionLength] = useState("7 days")
  const [guidelines, setGuidelines] = useState(DEFAULT_COMMUNITY_GUIDELINES)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Content review"
        subtitle="How submitted series and episodes are reviewed."
      >
        <SettingsField label="Default review mode">
          <Select value={reviewMode} onValueChange={setReviewMode}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REVIEW_MODE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <ToggleField
          label="Require thumbnail approval"
          hint="Block new thumbnails from going live until an admin approves."
          checked={thumbnailApproval}
          onCheckedChange={setThumbnailApproval}
        />
        <ToggleField
          label="Auto-flag adult content"
          hint="Run an automatic safety check on new uploads."
          checked={autoFlagAdult}
          onCheckedChange={setAutoFlagAdult}
        />
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Strikes & suspensions"
        subtitle="What happens when a creator breaks the guidelines."
      >
        <SettingsField label="Strikes before suspension">
          <Input
            type="number"
            value={strikesBeforeSuspend}
            onChange={(event) => setStrikesBeforeSuspend(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Default suspension length">
          <Select value={suspensionLength} onValueChange={setSuspensionLength}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUSPENSION_LENGTH_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField
          label="Community guidelines"
          hint="Shown to creators during onboarding and in the help center."
          className="sm:grid-cols-1 sm:items-start"
        >
          <Textarea
            value={guidelines}
            onChange={(event) => setGuidelines(event.target.value)}
            rows={4}
          />
        </SettingsField>
      </SettingsSection>
    </SettingsPanel>
  )
}
