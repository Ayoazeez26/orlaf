import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { Download, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import { uploadAvatar } from "../api/profile-upload"
import { SettingsActionRow } from "../components/settings-action-row"
import { SettingsField } from "../components/settings-field"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { PRONOUNS_OPTIONS } from "../constants"
import { useProfile, useUpdateProfile } from "../hooks/use-profile"
import {
  registerSettingsReset,
  registerSettingsSave,
} from "../lib/settings-form-actions"

function getInitials(firstName: string, lastName: string, email: string) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim()
  return (initials || email.charAt(0) || "?").toUpperCase()
}

function buildInitialForm(
  data: NonNullable<ReturnType<typeof useProfile>["data"]>
) {
  const username =
    data.displayName?.replace(/^@/, "") ??
    data.creatorProfile?.handle?.replace(/^@/, "") ??
    ""

  return {
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    username,
    pronouns: "She / her",
    bio: data.bio ?? "",
    phone: data.phone ?? "",
    avatarUrl: data.avatarUrl ?? "",
  }
}

export function SettingsProfilePage() {
  const { data } = useProfile()
  const updateProfile = useUpdateProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const initialFormRef = useRef<ReturnType<typeof buildInitialForm> | null>(
    null
  )
  const isDirtyRef = useRef(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    pronouns: "She / her",
    bio: "",
    phone: "",
    avatarUrl: "",
  })

  function updateForm(updater: React.SetStateAction<typeof form>) {
    isDirtyRef.current = true
    setForm(updater)
  }

  useEffect(() => {
    if (!data || isDirtyRef.current) return
    const initial = buildInitialForm(data)
    initialFormRef.current = initial
    setForm(initial)
  }, [data])

  useEffect(() => {
    if (!data) return

    function handleSave() {
      const avatarUrl = form.avatarUrl.trim() ? form.avatarUrl : null
      updateProfile.mutate(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          displayName: form.username
            ? `@${form.username.replace(/^@/, "")}`
            : undefined,
          bio: form.bio,
          phone: form.phone,
          avatarUrl,
        },
        {
          onSuccess: (response) => {
            const saved = {
              ...form,
              firstName: response.firstName ?? form.firstName,
              lastName: response.lastName ?? form.lastName,
              username:
                response.displayName?.replace(/^@/, "") ?? form.username,
              bio: response.bio ?? form.bio,
              phone: response.phone ?? form.phone,
              avatarUrl: response.avatarUrl ?? "",
            }
            initialFormRef.current = saved
            setForm(saved)
            isDirtyRef.current = false
            toast.success("Profile saved.")
          },
          onError: (error) => {
            toastMutationError(error, "Failed to save profile")
          },
        }
      )
    }

    function handleReset() {
      if (initialFormRef.current) {
        setForm(initialFormRef.current)
        isDirtyRef.current = false
      }
    }

    const unregisterSave = registerSettingsSave(handleSave)
    const unregisterReset = registerSettingsReset(handleReset)
    return () => {
      unregisterSave()
      unregisterReset()
    }
  }, [data, form, updateProfile])

  if (!data) return <SettingsPageSkeleton />

  const initials = getInitials(form.firstName, form.lastName, data.email)
  const email = data.email

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setIsUploadingAvatar(true)
    try {
      const { imageUrl } = await uploadAvatar(file)
      setForm((prev) => ({ ...prev, avatarUrl: imageUrl }))
      isDirtyRef.current = true
      await updateProfile.mutateAsync({ avatarUrl: imageUrl })
      toast.success("Avatar updated.")
    } catch (error) {
      toastMutationError(error, "Avatar upload failed")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Profile"
        description="How you appear to your audience and the Sable team."
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 border-border border-b pb-6">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="Profile avatar"
                className="size-16 rounded-full border-2 border-border object-cover"
              />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xl">
                {initials}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  "Upload photo"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() =>
                  updateForm((prev) => ({ ...prev, avatarUrl: "" }))
                }
              >
                Remove
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField
              label="First name"
              value={form.firstName}
              onChange={(value) =>
                updateForm((prev) => ({ ...prev, firstName: value }))
              }
            />
            <SettingsField
              label="Last name"
              value={form.lastName}
              onChange={(value) =>
                updateForm((prev) => ({ ...prev, lastName: value }))
              }
            />
            <SettingsField
              label="Username"
              value={form.username}
              prefix="@"
              onChange={(value) =>
                updateForm((prev) => ({
                  ...prev,
                  username: value.replace(/^@/, ""),
                }))
              }
            />
            <div className="space-y-2">
              <p className="font-medium text-foreground text-sm">Pronouns</p>
              <Select
                value={form.pronouns}
                onValueChange={(value) =>
                  updateForm((prev) => ({ ...prev, pronouns: value }))
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRONOUNS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SettingsField label="Email" value={email} readOnly />
            <SettingsField
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                updateForm((prev) => ({ ...prev, phone: value }))
              }
            />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">Bio</p>
            <Textarea
              value={form.bio}
              onChange={(e) =>
                updateForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="min-h-[90px] bg-input-bg"
            />
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Account management"
        description="Control your data, visibility, and account status."
      >
        <SettingsActionRow
          title="Export your data"
          description="Profile, preferences, and activity — emailed as a download link."
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
          title="Deactivate account"
          description="Temporarily disable sign-in. Reactivate within 30 days."
          action={
            <Button type="button" variant="outline" className="rounded-lg">
              Deactivate
            </Button>
          }
        />
        <SettingsActionRow
          title="Delete account"
          description="Permanently remove your account and all personal data."
          destructive
          action={
            <Button
              type="button"
              className="rounded-lg bg-trend-negative text-white hover:bg-trend-negative/90"
            >
              Delete
            </Button>
          }
        />
      </SettingsSectionCard>
    </div>
  )
}
