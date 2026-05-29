import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Eye, KeyRound, LogOut, Monitor, Phone } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsSecurityPage() {
  const { data } = useSettingsDashboard()
  if (!data) return null

  return (
    <div className="max-w-3xl space-y-6">
      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Password</p>
          <p className="text-muted-foreground text-sm">
            Change your account password
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium text-foreground text-sm">
              Current Password
            </p>
            <div className="relative">
              <Input
                value={data.security.password.current}
                className="bg-input-bg pr-10"
                readOnly
              />
              <Eye
                className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New Password" value={data.security.password.next} />
            <Field
              label="Confirm New Password"
              value={data.security.password.confirm}
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">
            Two-Factor Authentication
          </p>
          <p className="text-muted-foreground text-sm">
            Add an extra layer of security to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.security.methods.map((method) => {
            const Icon = method.icon === "key" ? KeyRound : Phone
            return (
              <div
                key={method.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-subtle p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-4 text-primary" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm">{method.label}</p>
                    <p className="text-muted-foreground text-sm">
                      {method.description}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className={FROSTED_CARD_SURFACE_CLASS}>
        <CardHeader>
          <p className="font-semibold text-foreground">Active Sessions</p>
          <p className="text-muted-foreground text-sm">
            Devices currently signed in to your account
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.security.sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex min-w-0 items-start gap-3">
                <Monitor
                  className="mt-0.5 size-4 text-muted-foreground"
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-sm">{session.device}</p>
                    {session.current ? (
                      <Badge className="bg-trend-positive-muted text-trend-positive">
                        Current
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current ? (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-destructive"
                >
                  Revoke
                </Button>
              ) : null}
            </div>
          ))}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <LogOut className="size-4" aria-hidden />
              Sign Out All Other Devices
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
