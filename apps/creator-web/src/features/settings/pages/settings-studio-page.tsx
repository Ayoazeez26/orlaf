import type { UpdateStudioRequest } from "@sable/contracts"
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
import { toast, toastMutationError } from "@/lib/toast"
import { uploadStudioLogo } from "../api/profile-upload"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { SettingsActionRow } from "../components/settings-action-row"
import { SettingsField } from "../components/settings-field"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { SoloCreatorStudioGate } from "../components/solo-creator-studio-gate"
import { COUNTRY_OPTIONS, GENRE_OPTIONS, TEAM_SIZE_OPTIONS } from "../constants"
import { useProfile, useUpdateStudio } from "../hooks/use-profile"
import { getWorkspaceDisplayName } from "../lib/get-workspace-display-name"
import {
  registerSettingsReset,
  registerSettingsSave,
} from "../lib/settings-form-actions"

const DEFAULT_STUDIO_FORM = {
  studioName: "",
  handle: "",
  tagline: "",
  website: "",
  teamSize: "1-5 people",
  primaryGenre: "Drama",
  country: "Nigeria",
}

function normalizeHandle(value: string | null | undefined) {
  return (value ?? "").replace(/^@/, "").trim()
}

function buildStudioPatch(
  form: typeof DEFAULT_STUDIO_FORM,
  initial: typeof DEFAULT_STUDIO_FORM
): UpdateStudioRequest {
  const patch: UpdateStudioRequest = {}

  if (form.studioName !== initial.studioName) {
    patch.studioName = form.studioName
  }

  const nextHandle = normalizeHandle(form.handle)
  const prevHandle = normalizeHandle(initial.handle)
  if (nextHandle !== prevHandle && nextHandle.length > 0) {
    patch.handle = nextHandle
  }

  if (form.tagline !== initial.tagline) {
    patch.description = form.tagline
  }

  if (form.website !== initial.website) {
    patch.studioWebsite = form.website.trim()
  }

  return patch
}

export function SettingsStudioPage() {
  const { data, isLoading } = useProfile()
  const updateStudio = useUpdateStudio()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const initialFormRef = useRef<typeof DEFAULT_STUDIO_FORM | null>(null)

  const [form, setForm] = useState(DEFAULT_STUDIO_FORM)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!data || hasInitialized.current) return
    hasInitialized.current = true
    const initial = {
      studioName: data.creatorProfile?.studioName ?? "",
      handle: normalizeHandle(data.creatorProfile?.handle),
      tagline: data.creatorProfile?.description ?? "",
      website: data.creatorProfile?.studioWebsite ?? "",
      teamSize: DEFAULT_STUDIO_FORM.teamSize,
      primaryGenre: DEFAULT_STUDIO_FORM.primaryGenre,
      country: DEFAULT_STUDIO_FORM.country,
    }
    initialFormRef.current = initial
    setForm(initial)
  }, [data])

  useEffect(() => {
    if (data?.creatorProfile?.creatorType !== "studio") return

    function handleSave() {
      const initial = initialFormRef.current
      if (!initial) return

      const patch = buildStudioPatch(form, initial)
      if (Object.keys(patch).length === 0) return

      updateStudio.mutate(patch, {
        onSuccess: (profile) => {
          const saved = {
            ...form,
            studioName: profile.studioName ?? form.studioName,
            handle: normalizeHandle(profile.handle ?? form.handle),
            tagline: profile.description ?? form.tagline,
            website: profile.studioWebsite ?? form.website,
          }
          initialFormRef.current = saved
          setForm(saved)
          toast.success("Studio settings saved.")
        },
        onError: (error) => {
          toastMutationError(error, "Failed to save studio")
        },
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

  if (isLoading || !data) return <SettingsPageSkeleton />

  const isStudioCreator = data.creatorProfile?.creatorType === "studio"

  if (!isStudioCreator) {
    return (
      <SoloCreatorStudioGate workspaceName={getWorkspaceDisplayName(data)} />
    )
  }

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
                toast.success("Studio logo updated.")
              } catch (error) {
                toastMutationError(error, "Failed to upload studio logo")
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
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Delete
            </Button>
          }
        />
      </SettingsSectionCard>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this studio?"
        description="This will permanently remove the studio, all projects, and payout history. Studio deletion is not enabled yet."
        confirmLabel="Delete studio"
        onConfirm={() => setDeleteOpen(false)}
      />
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
        <SelectTrigger className="h-10 w-full">
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
