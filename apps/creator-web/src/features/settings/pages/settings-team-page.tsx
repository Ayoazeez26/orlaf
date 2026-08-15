import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { SettingsPageSkeleton } from "../components/settings-page-skeleton"
import { SettingsSectionCard } from "../components/settings-section-card"
import { SoloCreatorTeamGate } from "../components/solo-creator-team-gate"
import { useProfile } from "../hooks/use-profile"
import type { TeamMember } from "../types"

function initialsFromProfile(profile: {
  firstName: string | null
  lastName: string | null
  displayName: string | null
  email: string
}): string {
  const fromName = [profile.firstName?.[0], profile.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase()
  if (fromName) return fromName
  const fromDisplay = profile.displayName?.trim()?.[0]
  if (fromDisplay) return fromDisplay.toUpperCase()
  return profile.email[0]?.toUpperCase() ?? "?"
}

export function SettingsTeamPage() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading || !profile) return <SettingsPageSkeleton />

  const isStudioCreator = profile.creatorProfile?.creatorType === "studio"

  if (!isStudioCreator) {
    return <SoloCreatorTeamGate />
  }

  const ownerName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
    profile.displayName?.trim() ||
    profile.email

  const members: TeamMember[] = [
    {
      id: profile.id,
      name: ownerName,
      email: profile.email,
      initials: initialsFromProfile(profile),
      role: "Owner",
    },
  ]

  return (
    <SettingsSectionCard
      title="Team"
      description="Manage who has access to Sable Studio."
      headerAction={
        <Button
          type="button"
          size="sm"
          className="gap-1.5 rounded-lg"
          disabled
          title="Team invites are coming soon"
        >
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
            Team invites are coming soon. You are the only member for now.
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
