import { useNavigate, useParams } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import {
  AlertTriangle,
  Archive,
  Coins,
  Keyboard,
  Loader2,
  Unlock,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { SettingsModalShell } from "@/features/settings/components/settings-modal-shell"
import { LANGUAGE_OPTIONS } from "../../constants"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import {
  useArchiveProject,
  useProject,
  useUpdateProjectSettings,
} from "../../hooks/use-project"
import { toast, toastMutationError } from "@/lib/toast"
import type { ProjectDetail } from "../../types"

const VISIBILITY_OPTIONS = ["Public", "Unlisted", "Private"] as const

const SUBTITLE_TRACK_OPTIONS = [
  "English",
  "French",
  "Spanish",
  "Portuguese",
  "Swahili",
  "Arabic",
] as const

type VisibilityOption = (typeof VISIBILITY_OPTIONS)[number]

interface SettingsFormState {
  visibility: VisibilityOption
  language: string
  commentsEnabled: boolean
  monetizationEnabled: boolean
  subtitleTracks: string[]
  autoCaptionEnabled: boolean
  access: ProjectDetail["access"]
}

function visibilityFromProject(
  visibility: ProjectDetail["visibility"]
): VisibilityOption {
  if (!visibility.public) return "Private"
  if (!visibility.listedInSearch) return "Unlisted"
  return "Public"
}

function visibilityToPatch(visibility: VisibilityOption) {
  switch (visibility) {
    case "Private":
      return { public: false, listedInSearch: false }
    case "Unlisted":
      return { public: true, listedInSearch: false }
    default:
      return { public: true, listedInSearch: true }
  }
}

function buildFormState(project: ProjectDetail): SettingsFormState {
  return {
    visibility: visibilityFromProject(project.visibility),
    language: project.language ?? "English",
    commentsEnabled: project.visibility.commentsEnabled,
    monetizationEnabled: project.monetization.tippingEnabled,
    subtitleTracks: project.subtitleTracks,
    autoCaptionEnabled: project.autoCaptionEnabled,
    access: project.access,
  }
}

function formsEqual(a: SettingsFormState, b: SettingsFormState) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function ProjectSettingsTab() {
  const navigate = useNavigate()
  const { projectId } = useParams({ strict: false })
  const id = projectId ?? ""
  const { data: project } = useProject(id)
  const updateSettings = useUpdateProjectSettings(id)
  const archiveProject = useArchiveProject(id)
  const [savedForm, setSavedForm] = useState<SettingsFormState | null>(null)
  const [form, setForm] = useState<SettingsFormState | null>(null)
  const [archiveOpen, setArchiveOpen] = useState(false)

  useEffect(() => {
    if (!project) return
    const next = buildFormState(project)
    setSavedForm(next)
    setForm(next)
  }, [project])

  const isDirty = useMemo(() => {
    if (!form || !savedForm) return false
    return !formsEqual(form, savedForm)
  }, [form, savedForm])

  if (!project || !form) return null

  function updateForm(patch: Partial<SettingsFormState>) {
    setForm((current) => (current ? { ...current, ...patch } : current))
  }

  function handleCancel() {
    if (savedForm) setForm(savedForm)
  }

  async function handleSave() {
    if (!form) return

    const visibilityPatch = visibilityToPatch(form.visibility)

    try {
      const updated = await updateSettings.mutateAsync({
        ...visibilityPatch,
        commentsEnabled: form.commentsEnabled,
        tippingEnabled: form.monetizationEnabled,
        language: form.language,
        subtitleTracks: form.subtitleTracks,
        autoCaptionEnabled: form.autoCaptionEnabled,
        access: form.access,
      })
      const next = buildFormState(updated)
      setSavedForm(next)
      setForm(next)
      toast.success("Project settings saved.")
    } catch (error) {
      toastMutationError(error, "Unable to save changes. Please try again.")
    }
  }

  async function handleArchive() {
    try {
      await archiveProject.mutateAsync()
      toast.success("Series archived.")
      setArchiveOpen(false)
      void navigate({ to: "/dashboard/projects" })
    } catch (error) {
      toastMutationError(
        error,
        "Unable to archive this series. Please try again."
      )
    }
  }

  function toggleSubtitleTrack(track: string) {
    updateForm({
      subtitleTracks: form.subtitleTracks.includes(track)
        ? form.subtitleTracks.filter((item) => item !== track)
        : [...form.subtitleTracks, track],
    })
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <SettingsSectionCard
        title="Distribution"
        description="Control visibility, language, and monetization."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Visibility</Label>
            <Select
              value={form.visibility}
              onValueChange={(value) =>
                updateForm({ visibility: value as VisibilityOption })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select
              value={form.language}
              onValueChange={(language) => updateForm({ language })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ToggleSettingRow
          title="Allow comments"
          description="Viewers can comment on episodes."
          checked={form.commentsEnabled}
          onCheckedChange={(commentsEnabled) => updateForm({ commentsEnabled })}
        />
        <ToggleSettingRow
          title="Monetization"
          description="Earn revenue from ads and tips on this project."
          checked={form.monetizationEnabled}
          onCheckedChange={(monetizationEnabled) =>
            updateForm({ monetizationEnabled })
          }
        />
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Subtitles & captions"
        description="Pick the subtitle languages you'll publish, and let Sable AI fill the gaps."
      >
        <div className="space-y-3">
          <p className="font-medium text-foreground text-sm">Subtitle tracks</p>
          <div className="flex flex-wrap gap-2">
            {SUBTITLE_TRACK_OPTIONS.map((track) => {
              const selected = form.subtitleTracks.includes(track)

              return (
                <button
                  key={track}
                  type="button"
                  onClick={() => toggleSubtitleTrack(track)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-medium text-sm transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-muted-foreground/40"
                  )}
                >
                  <Keyboard className="size-3.5" aria-hidden />
                  {track}
                </button>
              )
            })}
          </div>
        </div>

        <ToggleSettingRow
          title="Auto-caption with Sable AI"
          description="Generate subtitles automatically for languages you haven't uploaded."
          checked={form.autoCaptionEnabled}
          onCheckedChange={(autoCaptionEnabled) =>
            updateForm({ autoCaptionEnabled })
          }
        />
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Access & pricing"
        description="Make this project free to watch or gate it behind coins."
      >
        <div className="grid grid-cols-2 gap-3">
          <AccessToggleButton
            label="Free"
            icon={Unlock}
            selected={form.access === "free"}
            onClick={() => updateForm({ access: "free" })}
          />
          <AccessToggleButton
            label="Coin-gated"
            icon={Coins}
            selected={form.access === "coins"}
            onClick={() => updateForm({ access: "coins" })}
          />
        </div>
      </SettingsSectionCard>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-amber-500"
              aria-hidden
            />
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Archive project</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Archived projects are hidden from your library but kept safe.
                You can restore them anytime, or permanently delete them, from
                Settings → Archive.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={archiveProject.isPending}
            onClick={() => setArchiveOpen(true)}
          >
            <Archive className="size-4" aria-hidden />
            Archive project
          </Button>
        </CardContent>
      </Card>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-4")}>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            {updateSettings.isPending
              ? "Saving changes…"
              : isDirty
                ? "You have unsaved changes"
                : "All changes saved"}
          </p>
          <div className="flex gap-3 sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              disabled={!isDirty || updateSettings.isPending}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isDirty || updateSettings.isPending}
              onClick={() => void handleSave()}
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
        </CardContent>
      </Card>

      <SettingsModalShell
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive project?"
        description={`"${project.title}" will be hidden from your projects list. You can restore it from Settings → Archive.`}
        footer={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setArchiveOpen(false)}
              disabled={archiveProject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleArchive()}
              disabled={archiveProject.isPending}
            >
              {archiveProject.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Archiving…
                </>
              ) : (
                "Archive project"
              )}
            </Button>
          </div>
        }
      >
        <p className="text-muted-foreground text-sm">
          Episodes and analytics data are kept. The series can be restored from
          the archive.
        </p>
      </SettingsModalShell>
    </div>
  )
}

function SettingsSectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "gap-0 py-6")}>
      <CardHeader className="gap-1 pb-5">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  )
}

function ToggleSettingRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-border border-t pt-5">
      <div>
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="mt-1 text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

function AccessToggleButton({
  label,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string
  icon: typeof Unlock
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-sm transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-background text-foreground hover:border-muted-foreground/40"
      )}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  )
}
