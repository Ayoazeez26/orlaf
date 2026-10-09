import type { CreatorSignupMode } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useCreatorsSettingsQuery,
  useUpdateCreatorsSettings,
} from "../../api/creators-settings-hooks"
import { SIGNUP_MODE_OPTIONS } from "../../constants"
import { registerSettingsSave } from "../../lib/settings-form-actions"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

const SIGNUP_MODE_TO_VALUE: Record<
  (typeof SIGNUP_MODE_OPTIONS)[number],
  CreatorSignupMode
> = {
  "Invite only": "invite_only",
  "Open applications": "open",
  Closed: "closed",
}

const VALUE_TO_SIGNUP_MODE: Record<
  CreatorSignupMode,
  (typeof SIGNUP_MODE_OPTIONS)[number]
> = {
  invite_only: "Invite only",
  open: "Open applications",
  closed: "Closed",
}

export function SettingsCreatorsTab() {
  const { data, isLoading } = useCreatorsSettingsQuery()
  const updateSettings = useUpdateCreatorsSettings()

  const [signupMode, setSignupMode] =
    useState<(typeof SIGNUP_MODE_OPTIONS)[number]>("Open applications")
  const [requireApproval, setRequireApproval] = useState(false)
  const [autoApproveInvited, setAutoApproveInvited] = useState(true)
  const [requireId, setRequireId] = useState(false)
  const [questions, setQuestions] = useState("")
  const [minAccountAge, setMinAccountAge] = useState("60")
  const [minSeries, setMinSeries] = useState("3")
  const [zeroStrikes, setZeroStrikes] = useState(true)

  useEffect(() => {
    if (!data) return
    setSignupMode(VALUE_TO_SIGNUP_MODE[data.creatorSignupMode])
    setRequireApproval(data.creatorRequireApproval)
    setAutoApproveInvited(data.creatorAutoApproveInvited)
    setRequireId(data.creatorRequireGovernmentId)
    setQuestions(data.creatorApplicationQuestions)
    setMinAccountAge(String(data.creatorVerifyMinAccountAgeDays))
    setMinSeries(String(data.creatorVerifyMinPublishedSeries))
    setZeroStrikes(data.creatorVerifyRequireZeroStrikes)
  }, [data])

  const handleSave = useCallback(() => {
    const ageDays = Number.parseInt(minAccountAge, 10)
    const seriesCount = Number.parseInt(minSeries, 10)

    updateSettings.mutate(
      {
        creatorSignupMode: SIGNUP_MODE_TO_VALUE[signupMode],
        creatorRequireApproval: requireApproval,
        creatorAutoApproveInvited: autoApproveInvited,
        creatorRequireGovernmentId: requireId,
        creatorApplicationQuestions: questions,
        creatorVerifyMinAccountAgeDays: Number.isFinite(ageDays) ? ageDays : 60,
        creatorVerifyMinPublishedSeries: Number.isFinite(seriesCount)
          ? seriesCount
          : 3,
        creatorVerifyRequireZeroStrikes: zeroStrikes,
      },
      {
        onSuccess: () => toast.success("Creator settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save creator settings"),
      }
    )
  }, [
    signupMode,
    requireApproval,
    autoApproveInvited,
    requireId,
    questions,
    minAccountAge,
    minSeries,
    zeroStrikes,
    updateSettings,
  ])

  useEffect(() => registerSettingsSave(handleSave), [handleSave])

  return (
    <SettingsPanel>
      <SettingsSection
        title="Onboarding"
        subtitle="How new creators join Sable TV."
      >
        <SettingsField
          label="Sign-up mode"
          hint="Enforced on creator sign-up — invite-only rejects sign-ups without a valid invite token; closed rejects all creator sign-ups."
        >
          <Select
            value={signupMode}
            onValueChange={(value) =>
              setSignupMode(value as (typeof SIGNUP_MODE_OPTIONS)[number])
            }
          >
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
          label="Require admin approval"
          hint="New creators wait in the Onboarding queue for an admin to approve them before their account activates."
          checked={requireApproval}
          onCheckedChange={setRequireApproval}
        />
        <ToggleField
          label="Auto-approve invited creators"
          hint="Skip the approval queue for creators who signed up from an accepted invite."
          checked={autoApproveInvited}
          onCheckedChange={setAutoApproveInvited}
          disabled={!requireApproval}
        />
        <ToggleField
          label="Require government ID"
          hint="Not wired to anything yet — no ID verification feature exists in the product."
          checked={requireId}
          onCheckedChange={setRequireId}
        />
        <SettingsField
          label="Application questions"
          hint="Not wired to anything yet — the creator sign-up flow has no question step to show these in."
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
        subtitle="Enforced when an admin clicks Verify on a creator's profile."
      >
        <SettingsField label="Minimum account age (days)">
          <Input
            type="number"
            min={0}
            value={minAccountAge}
            onChange={(event) => setMinAccountAge(event.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Minimum published series">
          <Input
            type="number"
            min={0}
            value={minSeries}
            onChange={(event) => setMinSeries(event.target.value)}
            disabled={isLoading}
            className="h-9"
          />
        </SettingsField>
        <ToggleField
          label="Must have zero active strikes"
          hint="Creators with open strikes can't be verified."
          checked={zeroStrikes}
          onCheckedChange={setZeroStrikes}
        />
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
