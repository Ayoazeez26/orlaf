import type { ReviewMode } from "@sable/contracts"
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
import { useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  useGuidelinesQuery,
  useUpdateGuidelines,
} from "../../api/guidelines-hooks"
import {
  useModerationSettingsQuery,
  useUpdateModerationSettings,
} from "../../api/moderation-settings-hooks"
import { REVIEW_MODE_OPTIONS, SUSPENSION_LENGTH_OPTIONS } from "../../constants"
import {
  SettingsDivider,
  SettingsField,
  SettingsPanel,
  SettingsSection,
  ToggleField,
} from "../settings-shared"

const REVIEW_MODE_TO_VALUE: Record<
  (typeof REVIEW_MODE_OPTIONS)[number],
  ReviewMode
> = {
  "Manual review before publish": "manual",
  "Auto-publish with spot checks": "auto_spot_check",
  "Auto-publish": "auto_publish",
}

const VALUE_TO_REVIEW_MODE: Record<
  ReviewMode,
  (typeof REVIEW_MODE_OPTIONS)[number]
> = {
  manual: "Manual review before publish",
  auto_spot_check: "Auto-publish with spot checks",
  auto_publish: "Auto-publish",
}

const SUSPENSION_LENGTH_DAYS: Record<
  (typeof SUSPENSION_LENGTH_OPTIONS)[number],
  number
> = {
  "7 days": 7,
  "14 days": 14,
  "30 days": 30,
  Permanent: 0,
}

function daysToSuspensionLength(
  days: number
): (typeof SUSPENSION_LENGTH_OPTIONS)[number] {
  const entry = Object.entries(SUSPENSION_LENGTH_DAYS).find(
    ([, value]) => value === days
  )
  return (entry?.[0] as (typeof SUSPENSION_LENGTH_OPTIONS)[number]) ?? "7 days"
}

export function SettingsModerationTab() {
  const { data, isLoading } = useModerationSettingsQuery()
  const updateSettings = useUpdateModerationSettings()

  const [reviewMode, setReviewMode] = useState<
    (typeof REVIEW_MODE_OPTIONS)[number]
  >("Manual review before publish")
  const [thumbnailApproval, setThumbnailApproval] = useState(true)
  const [autoFlagAdult, setAutoFlagAdult] = useState(true)
  const [strikesBeforeSuspend, setStrikesBeforeSuspend] = useState("3")
  const [suspensionLength, setSuspensionLength] =
    useState<(typeof SUSPENSION_LENGTH_OPTIONS)[number]>("7 days")

  useEffect(() => {
    if (!data) return
    setReviewMode(VALUE_TO_REVIEW_MODE[data.reviewMode])
    setThumbnailApproval(data.requireThumbnailApproval)
    setAutoFlagAdult(data.autoFlagAdultContent)
    setStrikesBeforeSuspend(String(data.strikesBeforeSuspension))
    setSuspensionLength(daysToSuspensionLength(data.suspensionLengthDays))
  }, [data])

  const handleSaveModeration = () => {
    const strikes = Number.parseInt(strikesBeforeSuspend, 10)
    updateSettings.mutate(
      {
        reviewMode: REVIEW_MODE_TO_VALUE[reviewMode],
        requireThumbnailApproval: thumbnailApproval,
        autoFlagAdultContent: autoFlagAdult,
        strikesBeforeSuspension: Number.isFinite(strikes) ? strikes : 3,
        suspensionLengthDays: SUSPENSION_LENGTH_DAYS[suspensionLength],
      },
      {
        onSuccess: () => toast.success("Moderation settings saved"),
        onError: (error) =>
          toastMutationError(error, "Unable to save moderation settings"),
      }
    )
  }

  const guidelinesQuery = useGuidelinesQuery()
  const updateGuidelines = useUpdateGuidelines()
  const [guidelines, setGuidelines] = useState("")

  useEffect(() => {
    if (guidelinesQuery.data) setGuidelines(guidelinesQuery.data.content)
  }, [guidelinesQuery.data])

  const guidelinesDirty = guidelinesQuery.data
    ? guidelines !== guidelinesQuery.data.content
    : false

  const handleSaveGuidelines = () => {
    updateGuidelines.mutate(
      { content: guidelines },
      {
        onSuccess: () => toast.success("Community guidelines updated"),
        onError: (error) =>
          toastMutationError(error, "Unable to save community guidelines"),
      }
    )
  }

  return (
    <SettingsPanel>
      <SettingsSection
        title="Content review"
        subtitle="How submitted series and episodes are reviewed."
      >
        <SettingsField
          label="Default review mode"
          hint="Controls whether new series submissions skip manual review."
        >
          <Select
            value={reviewMode}
            onValueChange={(value) =>
              setReviewMode(value as (typeof REVIEW_MODE_OPTIONS)[number])
            }
          >
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
          hint="Forces manual review even under an auto-publish mode whenever a poster is set — there's no separate thumbnail-only approval flow yet."
          checked={thumbnailApproval}
          onCheckedChange={setThumbnailApproval}
        />
        <ToggleField
          label="Auto-flag adult content"
          hint="Not wired to anything yet — no content classifier exists in the product."
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
            min={1}
            max={20}
            value={strikesBeforeSuspend}
            onChange={(event) => setStrikesBeforeSuspend(event.target.value)}
            className="h-9"
          />
        </SettingsField>
        <SettingsField label="Default suspension length">
          <Select
            value={suspensionLength}
            onValueChange={(value) =>
              setSuspensionLength(
                value as (typeof SUSPENSION_LENGTH_OPTIONS)[number]
              )
            }
          >
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

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={handleSaveModeration}
            disabled={isLoading || updateSettings.isPending}
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save moderation settings"
            )}
          </Button>
        </div>

        <SettingsField
          label="Community guidelines"
          hint="Shown to creators during onboarding and in the Guidelines tab. Supports ## for section headings."
          className="sm:grid-cols-1 sm:items-start"
        >
          <div className="space-y-2">
            <Textarea
              value={guidelines}
              onChange={(event) => setGuidelines(event.target.value)}
              rows={16}
              disabled={guidelinesQuery.isLoading}
              className="font-mono text-xs"
            />
            <div className="flex items-center justify-end gap-3">
              {guidelinesQuery.data && (
                <span className="text-muted-foreground text-xs">
                  Last updated{" "}
                  {new Date(
                    guidelinesQuery.data.updatedAt
                  ).toLocaleDateString()}
                </span>
              )}
              <Button
                type="button"
                size="sm"
                disabled={!guidelinesDirty || updateGuidelines.isPending}
                onClick={handleSaveGuidelines}
              >
                {updateGuidelines.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  "Save guidelines"
                )}
              </Button>
            </div>
          </div>
        </SettingsField>
      </SettingsSection>
    </SettingsPanel>
  )
}
