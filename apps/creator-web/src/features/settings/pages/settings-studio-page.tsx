import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Camera, Copy, Loader2, Trash2, UserPlus } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { uploadStudioLogo } from "../api/profile-upload"
import { useProfile, useUpdateStudio } from "../hooks/use-profile"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsStudioPage() {
  const { data } = useProfile()
  const { data: dashboard } = useSettingsDashboard()
  const updateStudio = useUpdateStudio()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)

  const [form, setForm] = useState({
    studioName: "",
    handle: "",
    description: "",
    logoUrl: "",
  })

  useEffect(() => {
    if (!data) return
    setForm({
      studioName: data.creatorProfile?.studioName ?? "",
      handle: data.creatorProfile?.handle ?? "",
      description: data.creatorProfile?.description ?? "",
      logoUrl: data.creatorProfile?.logoUrl ?? "",
    })
  }, [data])

  if (!data || !dashboard) return null

  const initials = (form.studioName || dashboard.workspace.name)
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setLogoError(null)
    setIsUploadingLogo(true)
    try {
      const { imageUrl } = await uploadStudioLogo(file)
      setForm((prev) => ({ ...prev, logoUrl: imageUrl }))
      await updateStudio.mutateAsync({ logoUrl: imageUrl })
    } catch (error) {
      setLogoError(
        error instanceof Error ? error.message : "Logo upload failed"
      )
    } finally {
      setIsUploadingLogo(false)
    }
  }

  function handleSaveStudio() {
    updateStudio.mutate({
      studioName: form.studioName,
      handle: form.handle,
      description: form.description,
    })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Studio Details</p>
          <p className="text-muted-foreground text-sm">
            Manage your studio workspace on OrlAf
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 border-border border-b pb-6">
            <div className="relative">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Studio logo"
                  className="size-16 rounded-lg border-2 border-border-zinc-200 object-cover"
                />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-lg border-2 border-border-zinc-200 bg-primary/10 font-semibold text-primary text-xl">
                  {initials}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-60"
              >
                {isUploadingLogo ? (
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                ) : (
                  <Camera className="size-3" aria-hidden />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">
                {form.studioName || dashboard.workspace.name}
              </p>
              <p className="text-muted-foreground text-sm">
                @{form.handle || dashboard.studio.handle}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge className="border-0 bg-primary/10 text-primary">
                  Owner
                </Badge>
                <Badge variant="outline">
                  {data.creatorProfile?.plan ?? dashboard.studio.tier}
                </Badge>
              </div>
              {logoError && (
                <p className="text-destructive text-xs">{logoError}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Studio Name"
              value={form.studioName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, studioName: value }))
              }
            />
            <Field
              label="Handle"
              value={form.handle}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, handle: value }))
              }
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">Description</p>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-[90px] bg-input-bg"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Studio ID: {data.creatorProfile?.accountId ?? data.id}
            </span>
            <Copy className="size-4 text-muted-foreground" aria-hidden />
          </div>

          {updateStudio.isError && (
            <p className="text-destructive text-sm">
              {updateStudio.error instanceof Error
                ? updateStudio.error.message
                : "Failed to save studio"}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            {updateStudio.isSuccess && !updateStudio.isPending && (
              <p className="text-muted-foreground text-sm">Saved</p>
            )}
            <Button
              type="button"
              onClick={handleSaveStudio}
              disabled={updateStudio.isPending}
            >
              {updateStudio.isPending ? "Saving..." : "Save Studio"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0">
          <div>
            <p className="font-semibold text-foreground">Team Members</p>
            <p className="text-muted-foreground text-sm">
              People with access to this studio
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <UserPlus className="size-3.5" aria-hidden />
            Invite
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboard.studio.teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-foreground text-sm">
                    {member.name}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {member.email}
                  </p>
                </div>
              </div>
              <Badge className="border-0 bg-primary/10 text-primary">
                {member.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card
        className={`${FROSTED_CARD_SURFACE_CLASS} border-danger-zone-border`}
      >
        <CardHeader>
          <p className="font-semibold text-destructive">Danger Zone</p>
          <p className="text-muted-foreground text-sm">
            Irreversible actions for this studio
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <DangerRow
            title="Transfer Ownership"
            description="Move this studio to another account"
            action={
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg border-border-zinc-200 bg-background px-3 text-foreground hover:bg-muted"
              >
                Transfer
              </Button>
            }
          />
          <DangerRow
            title="Delete Studio"
            description="Permanently delete this studio and all its data"
            action={
              <Button
                type="button"
                className="h-9 gap-1.5 rounded-lg border-transparent bg-trend-negative px-3 text-white hover:bg-trend-negative/90 focus-visible:border-trend-negative focus-visible:ring-trend-negative/30"
              >
                <Trash2 className="size-3.5" aria-hidden />
                Delete
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-input-bg"
      />
    </div>
  )
}

function DangerRow({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div>
        <p className="text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {action}
    </div>
  )
}
