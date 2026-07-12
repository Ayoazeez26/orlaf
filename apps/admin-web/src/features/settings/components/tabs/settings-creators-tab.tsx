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
import { SIGNUP_MODE_OPTIONS } from "../../constants"
import { DEFAULT_APPLICATION_QUESTIONS } from "../../data/mock-settings"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

export function SettingsCreatorsTab() {
  const [signupMode, setSignupMode] = useState("Invite only")
  const [autoApprove, setAutoApprove] = useState(true)
  const [requireId, setRequireId] = useState(false)
  const [questions, setQuestions] = useState(DEFAULT_APPLICATION_QUESTIONS)
  const [minAccountAge, setMinAccountAge] = useState("60")
  const [minSeries, setMinSeries] = useState("3")
  const [zeroStrikes, setZeroStrikes] = useState(true)

  return (
    <SettingsPanel>
      <SettingsSection
        title="Onboarding"
        subtitle="How new creators join Sable TV."
      >
        <SettingsField label="Sign-up mode">
          <Select value={signupMode} onValueChange={setSignupMode}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIGNUP_MODE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsField>
        <ToggleField
          label="Auto-approve invited creators"
          hint="Skip the application review step when joining from an invite link."
          checked={autoApprove}
          onCheckedChange={setAutoApprove}
        />
        <ToggleField
          label="Require government ID"
          hint="Verify identity before a creator can publish their first series."
          checked={requireId}
          onCheckedChange={setRequireId}
        />
        <SettingsField
          label="Application questions"
          hint="Asked during creator sign-up."
          className="sm:grid-cols-1 sm:items-start"
        >
          <Textarea
            value={questions}
            onChange={(event) => setQuestions(event.target.value)}
            rows={4}
            className="sm:col-span-2"
          />
        </SettingsField>
      </SettingsSection>

      <SettingsDivider />

      <SettingsSection
        title="Verification"
        subtitle="Rules for the verified badge on creator profiles."
      >
        <SettingsField label="Minimum account age (days)">
          <Input
            type="number"
            value={minAccountAge}
            onChange={(event) => setMinAccountAge(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Minimum published series">
          <Input
            type="number"
            value={minSeries}
            onChange={(event) => setMinSeries(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <ToggleField
          label="Must have zero active strikes"
          hint="Creators with open moderation cases can't be verified."
          checked={zeroStrikes}
          onCheckedChange={setZeroStrikes}
        />
      </SettingsSection>
    </SettingsPanel>
  )
}
