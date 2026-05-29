import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Copy, Trash2, UserPlus } from "lucide-react"
import type { ReactNode } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsStudioPage() {
  const { data } = useSettingsDashboard()
  if (!data) return null

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
            <span className="flex size-16 items-center justify-center rounded-lg border-2 border-border-zinc-200 bg-primary/10 font-semibold text-primary text-xl">
              {data.workspace.initials}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">
                {data.studio.name}
              </p>
              <p className="text-muted-foreground text-sm">
                @{data.studio.handle}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge className="border-0 bg-primary/10 text-primary">
                  Owner
                </Badge>
                <Badge variant="outline">{data.studio.tier}</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Studio Name" value={data.studio.name} />
            <Field label="Handle" value={data.studio.handle} />
          </div>

          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">Description</p>
            <Textarea
              value={data.studio.description}
              className="min-h-[90px] bg-input-bg"
              readOnly
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Studio ID: {data.studio.studioId}
            </span>
            <Copy className="size-4 text-muted-foreground" aria-hidden />
          </div>

          <div className="flex justify-end">
            <Button type="button">Save Studio</Button>
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
          {data.studio.teamMembers.map((member) => (
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground text-sm">{label}</p>
      <Input value={value} className="bg-input-bg" readOnly />
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
    <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 last:border-b-0 last:pb-0">
      <div>
        <p className="text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {action}
    </div>
  )
}
