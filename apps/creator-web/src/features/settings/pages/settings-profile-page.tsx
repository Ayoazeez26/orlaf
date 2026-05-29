import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Camera, ExternalLink } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsProfilePage() {
  const { data } = useSettingsDashboard()
  const [social, setSocial] = useState(data?.profile.socialLinks ?? [])

  if (!data) return null

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
              <span className="flex size-20 items-center justify-center rounded-full border-2 border-border-zinc-200 bg-primary/10 font-semibold text-primary text-xl">
                {data.profile.initials}
              </span>
              <span className="absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Camera className="size-3.5" aria-hidden />
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Profile Photo</p>
              <p className="text-muted-foreground text-sm">
                JPG, PNG or GIF. Max 2 MB.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" value={data.profile.firstName} />
            <Field label="Last Name" value={data.profile.lastName} />
          </div>
          <Field label="Display Name" value={data.profile.displayName} />
          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">Bio</p>
            <Textarea
              value={data.profile.bio}
              className="min-h-[92px] bg-input-bg"
              readOnly
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" value={data.profile.email} />
            <Field label="Phone" value={data.profile.phone} />
          </div>
          <div className="flex justify-end">
            <Button type="button">Save Changes</Button>
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
          {social.map((link, index) => (
            <div
              key={link.platform}
              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[8.5rem_1fr] sm:gap-x-3"
            >
              <p className="inline-flex items-center gap-2 text-foreground text-sm">
                <ExternalLink
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                {link.platform}
              </p>
              <Input
                value={link.url}
                placeholder={`Your ${link.platform} URL`}
                onChange={(e) => {
                  const next = [...social]
                  next[index] = { ...next[index], url: e.target.value }
                  setSocial(next)
                }}
                className="bg-input-bg"
              />
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <Button type="button" variant="outline">
              Update Links
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Input value={value} className="bg-input-bg" readOnly />
    </div>
  )
}
