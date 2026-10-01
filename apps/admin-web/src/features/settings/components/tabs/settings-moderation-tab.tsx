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
import { REVIEW_MODE_OPTIONS, SUSPENSION_LENGTH_OPTIONS } from "../../constants"
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
