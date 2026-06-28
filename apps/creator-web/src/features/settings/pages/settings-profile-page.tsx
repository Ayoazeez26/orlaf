import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Camera, ExternalLink, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { uploadAvatar } from "../api/profile-upload"
import {
  useProfile,
  useUpdateProfile,
  useUpdateSocialLinks,
} from "../hooks/use-profile"

const SOCIAL_PLATFORMS = [
  { key: "instagramUrl", label: "Instagram" },
  { key: "twitterUrl", label: "Twitter / X" },
  { key: "youtubeUrl", label: "YouTube" },
  { key: "tiktokUrl", label: "TikTok" },
] as const

type SocialKey = (typeof SOCIAL_PLATFORMS)[number]["key"]

function getInitials(firstName: string, lastName: string, email: string) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim()
  return (initials || email.charAt(0) || "?").toUpperCase()
}

export function SettingsProfilePage() {
  const { data } = useProfile()
  const updateProfile = useUpdateProfile()
  const updateSocialLinks = useUpdateSocialLinks()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    bio: "",
    phone: "",
    avatarUrl: "",
  })
  const [social, setSocial] = useState<Record<SocialKey, string>>({
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
  })

  const hasInitialized = useRef(false)

  useEffect(() => {
    if (!data || hasInitialized.current) return
    hasInitialized.current = true
    setForm({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      displayName: data.displayName ?? "",
      bio: data.bio ?? "",
      phone: data.phone ?? "",
      avatarUrl: data.avatarUrl ?? "",
    })
    setSocial({
      instagramUrl: data.instagramUrl ?? "",
      twitterUrl: data.twitterUrl ?? "",
      youtubeUrl: data.youtubeUrl ?? "",
      tiktokUrl: data.tiktokUrl ?? "",
    })
  }, [data])

  if (!data) return null

  const initials = getInitials(form.firstName, form.lastName, data.email)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setAvatarError(null)
    setIsUploadingAvatar(true)
    try {
      const { imageUrl } = await uploadAvatar(file)
      setForm((prev) => ({ ...prev, avatarUrl: imageUrl }))
      await updateProfile.mutateAsync({ avatarUrl: imageUrl })
    } catch (error) {
      setAvatarError(
        error instanceof Error ? error.message : "Avatar upload failed"
      )
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  function handleSaveProfile() {
    updateProfile.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      displayName: form.displayName,
      bio: form.bio,
      phone: form.phone,
    })
  }

  function handleUpdateLinks() {
    // Backend validates non-empty values as URLs, so omit cleared fields
    // rather than sending empty strings.
    const payload = Object.fromEntries(
      Object.entries(social).filter(([, value]) => value.trim() !== "")
    )
    updateSocialLinks.mutate(payload)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Personal Information</p>
          <p className="text-muted-foreground text-sm">
            Update your creator profile visible to audiences
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 border-border border-b pb-6">
            <div className="relative">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="Profile avatar"
                  className="size-20 rounded-full border-2 border-border-zinc-200 object-cover"
                />
              ) : (
                <span className="flex size-20 items-center justify-center rounded-full border-2 border-border-zinc-200 bg-primary/10 font-semibold text-primary text-xl">
                  {initials}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-60"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Camera className="size-3.5" aria-hidden />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">Profile Photo</p>
              <p className="text-muted-foreground text-sm">
                JPG, PNG or WebP. Max 2 MB.
              </p>
              {avatarError && (
                <p className="text-destructive text-xs">{avatarError}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First Name"
              value={form.firstName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, firstName: value }))
              }
            />
            <Field
              label="Last Name"
              value={form.lastName}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, lastName: value }))
              }
            />
          </div>
          <Field
            label="Display Name"
            value={form.displayName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, displayName: value }))
            }
          />
          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">Bio</p>
            <Textarea
              value={form.bio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="min-h-[92px] bg-input-bg"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" value={data.email} readOnly />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, phone: value }))
              }
            />
          </div>
          {updateProfile.isError && (
            <p className="text-destructive text-sm">
              {updateProfile.error instanceof Error
                ? updateProfile.error.message
                : "Failed to save profile"}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            {updateProfile.isSuccess && !updateProfile.isPending && (
              <p className="text-muted-foreground text-sm">Saved</p>
            )}
            <Button
              type="button"
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Social Links</p>
          <p className="text-muted-foreground text-sm">
            Connect your social presence
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {SOCIAL_PLATFORMS.map(({ key, label }) => (
            <div
              key={key}
              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[8.5rem_1fr] sm:gap-x-3"
            >
              <p className="inline-flex items-center gap-2 text-foreground text-sm">
                <ExternalLink
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                {label}
              </p>
              <Input
                value={social[key]}
                placeholder={`Your ${label} URL`}
                onChange={(e) =>
                  setSocial((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="bg-input-bg"
              />
            </div>
          ))}
          {updateSocialLinks.isError && (
            <p className="text-destructive text-sm">
              {updateSocialLinks.error instanceof Error
                ? updateSocialLinks.error.message
                : "Failed to update links"}
            </p>
          )}
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleUpdateLinks}
              disabled={updateSocialLinks.isPending}
            >
              {updateSocialLinks.isPending ? "Updating..." : "Update Links"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Input
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="bg-input-bg"
        readOnly={readOnly}
      />
    </div>
  )
}
