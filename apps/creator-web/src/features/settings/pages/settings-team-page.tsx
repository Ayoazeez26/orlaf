import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { SettingsSectionCard } from "../components/settings-section-card"
import { SoloCreatorTeamGate } from "../components/solo-creator-team-gate"
import { useProfile } from "../hooks/use-profile"
import { useSettingsDashboard } from "../hooks/use-settings-dashboard"

export function SettingsTeamPage() {
  const { data: profile } = useProfile()
  const { data: dashboard } = useSettingsDashboard()

  if (!profile || !dashboard) return null

  const isStudioCreator = profile.creatorProfile?.creatorType === "studio"

  if (!isStudioCreator) {
    return <SoloCreatorTeamGate />
  }

  const members = dashboard.studio.teamMembers

  return (
    <SettingsSectionCard
      title="Team"
      description="Manage who has access to Sable Studio."
      headerAction={
        <Button type="button" size="sm" className="gap-1.5 rounded-lg">
          <UserPlus className="size-3.5" aria-hidden />
          Invite members
        </Button>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="font-medium text-foreground text-sm">
            Members ({members.length})
          </p>
          <p className="text-muted-foreground text-sm">
            Owners and Admins can manage roles and invites.
          </p>
        </div>

        <div className="divide-y rounded-xl border border-border">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 px-4 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-foreground text-sm">
                      {member.name}
                    </p>
                    {member.pending ? (
                      <Badge
                        variant="outline"
                        className="border-transparent bg-muted px-2 py-0.5 text-muted-foreground text-xs"
                      >
                        Pending
                      </Badge>
                    ) : null}
                  </div>
                  <p className="truncate text-muted-foreground text-xs">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-transparent bg-muted px-2.5 py-1 font-medium text-foreground text-xs"
                >
                  {member.role}
                </Badge>
                {member.role !== "Owner" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground"
                    aria-label={`Actions for ${member.name}`}
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsSectionCard>
  )
}
