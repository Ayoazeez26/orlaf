import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ArrowLeftRight, Copy, Download, Loader2, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { uploadStudioLogo } from "../api/profile-upload"
import { SettingsActionRow } from "../components/settings-action-row"
import { SettingsField } from "../components/settings-field"
import { SettingsSectionCard } from "../components/settings-section-card"
import { SoloCreatorStudioGate } from "../components/solo-creator-studio-gate"
import { COUNTRY_OPTIONS, GENRE_OPTIONS, TEAM_SIZE_OPTIONS } from "../constants"
import { useProfile, useUpdateStudio } from "../hooks/use-profile"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"
import { getWorkspaceDisplayName } from "../lib/get-workspace-display-name"
import {
  registerSettingsReset,
  registerSettingsSave,
} from "../lib/settings-form-actions"

export function SettingsStudioPage() {
  const { data, isLoading } = useProfile()
  const { data: dashboard } = useSettingsDashboard()
  const updateStudio = useUpdateStudio()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const initialFormRef = useRef<{
    studioName: string
    handle: string
    tagline: string
    website: string
    teamSize: string
    primaryGenre: string
    country: string
  } | null>(null)

  const [form, setForm] = useState({
    studioName: "",
    handle: "",
    tagline: "",
    website: "",
    teamSize: "1-5 people",
    primaryGenre: "Drama",
    country: "Nigeria",
  })

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!data || hasInitialized.current) return
    hasInitialized.current = true
    const initial = {
      studioName:
        data.creatorProfile?.studioName ?? dashboard?.studio.name ?? "",
      handle: data.creatorProfile?.handle ?? dashboard?.studio.handle ?? "",
      tagline:
        data.creatorProfile?.description ?? dashboard?.studio.tagline ?? "",
      website:
        data.creatorProfile?.studioWebsite ?? dashboard?.studio.website ?? "",
      teamSize: dashboard?.studio.teamSize ?? "1-5 people",
      primaryGenre: dashboard?.studio.primaryGenre ?? "Drama",
      country: dashboard?.studio.country ?? "Nigeria",
    }
    initialFormRef.current = initial
    setForm(initial)
  }, [data, dashboard])

  useEffect(() => {
    if (data?.creatorProfile?.creatorType !== "studio") return

    function handleSave() {
      updateStudio.mutate({
        studioName: form.studioName,
        handle: form.handle,
        description: form.tagline,
      })
    }

    function handleReset() {
      if (initialFormRef.current) setForm(initialFormRef.current)
    }

    const unregisterSave = registerSettingsSave(handleSave)
    const unregisterReset = registerSettingsReset(handleReset)
    return () => {
      unregisterSave()
      unregisterReset()
    }
  }, [data, form, updateStudio])

  if (isLoading || !data) return null

  const isStudioCreator = data.creatorProfile?.creatorType === "studio"

  if (!isStudioCreator) {
    return (
      <SoloCreatorStudioGate
        workspaceName={getWorkspaceDisplayName(data, dashboard?.workspace.name)}
      />
    )
  }

  if (!dashboard) return null

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Studio"
        description="Your public studio page on Sable TV."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField
              label="Studio name"
              value={form.studioName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, studioName: value }))
              }
            />
            <SettingsField
              label="Handle"
              value={form.handle}
              prefix="sable.tv/"
              suffix={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 px-2 text-muted-foreground"
                >
                  <Copy className="size-3.5" aria-hidden />
                  Copy
                </Button>
              }
              onChange={(value) =>
                setForm((prev) => ({ ...prev, handle: value }))
              }
            />
          </div>

          <SettingsField
            label="Tagline"
            value={form.tagline}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, tagline: value }))
            }
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField
              label="Website"
              value={form.website}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, website: value }))
              }
            />
            <SelectField
              label="Team size"
              value={form.teamSize}
              options={TEAM_SIZE_OPTIONS}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, teamSize: value }))
              }
            />
            <SelectField
              label="Primary genre"
              value={form.primaryGenre}
              options={GENRE_OPTIONS}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, primaryGenre: value }))
              }
            />
            <SelectField
              label="Country"
              value={form.country}
              options={COUNTRY_OPTIONS}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, country: value }))
              }
            />
          </div>

          {updateStudio.isError && (
            <p className="text-destructive text-sm">
              {updateStudio.error instanceof Error
                ? updateStudio.error.message
                : "Failed to save studio"}
            </p>
          )}
          {updateStudio.isSuccess && !updateStudio.isPending ? (
            <p className="text-muted-foreground text-sm">Saved</p>
          ) : null}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ""
              if (!file) return
              setIsUploadingLogo(true)
              try {
                const { imageUrl } = await uploadStudioLogo(file)
                await updateStudio.mutateAsync({ logoUrl: imageUrl })
              } finally {
                setIsUploadingLogo(false)
              }
            }}
          />
          {isUploadingLogo ? (
            <p className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Uploading logo…
            </p>
          ) : null}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Studio management"
        description="Transfer, export, or remove this workspace."
      >
        <SettingsActionRow
          title="Transfer ownership"
          description="Hand the Owner role to a teammate. You become an Admin."
          action={
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-lg"
            >
              <ArrowLeftRight className="size-4" aria-hidden />
              Transfer
            </Button>
          }
        />
        <SettingsActionRow
          title="Export studio data"
          description="Projects, analytics, and payout history as a ZIP archive."
          action={
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-lg"
            >
              <Download className="size-4" aria-hidden />
              Export
            </Button>
          }
        />
        <SettingsActionRow
          title="Deactivate studio"
          description="Hide the studio page and pause all promotions. Reversible."
          action={
            <Button type="button" variant="outline" className="rounded-lg">
              Deactivate
            </Button>
          }
        />
        <SettingsActionRow
          title="Delete studio"
          description="Permanently remove this studio, all projects, and payout history."
          destructive
          action={
            <Button
              type="button"
              className="gap-1.5 rounded-lg bg-trend-negative text-white hover:bg-trend-negative/90"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Delete
            </Button>
          }
        />
      </SettingsSectionCard>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full bg-input-bg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
