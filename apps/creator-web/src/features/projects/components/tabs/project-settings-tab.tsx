import { useParams } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import { BarChart2 } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "../../constants/frosted-card"
import { useProject, useUpdateProjectSettings } from "../../hooks/use-project"

export function ProjectSettingsTab() {
  const { projectId } = useParams({ strict: false })
  const id = projectId ?? ""
  const { data: project } = useProject(id)
  const updateSettings = useUpdateProjectSettings(id)

  if (!project) return null

  const visibility = project.visibility
  const monetization = project.monetization

  function patchVisibility(key: keyof typeof visibility, value: boolean) {
    updateSettings.mutate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardHeader>
          <p className="font-semibold text-foreground text-sm">Visibility</p>
        </CardHeader>
        <CardContent>
          <SettingRow
            title="Public"
            description="Anyone can discover and watch this series"
          >
            <Switch
              checked={visibility.public}
              onCheckedChange={(v) => patchVisibility("public", v)}
            />
          </SettingRow>
          <SettingRow
            title="Listed in search"
            description="Appears in OrlAf search results"
          >
            <Switch
              checked={visibility.listedInSearch}
              onCheckedChange={(v) => patchVisibility("listedInSearch", v)}
            />
          </SettingRow>
          <SettingRow
            title="Comments enabled"
            description="Allow viewers to comment on episodes"
          >
            <Switch
              checked={visibility.commentsEnabled}
              onCheckedChange={(v) => patchVisibility("commentsEnabled", v)}
            />
          </SettingRow>
        </CardContent>
      </Card>

      <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
        <CardHeader>
          <p className="font-semibold text-foreground text-sm">Monetization</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <SettingRow
            title="Tipping enabled"
            description="Allow viewers to send tips on episodes"
          >
            <Switch
              checked={monetization.tippingEnabled}
              onCheckedChange={(v) =>
                updateSettings.mutate({ tippingEnabled: v })
              }
            />
          </SettingRow>
          <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "rounded-4xl p-5")}>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                  Series Revenue
                </p>
                <p className="mt-2 font-bold text-3xl text-foreground tracking-tight">
                  ${monetization.seriesRevenue}
                </p>
              </div>
              <Button variant="outline" className="w-full sm:w-auto" size="sm">
                <BarChart2 className="size-4" aria-hidden />
                View Earnings
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-foreground text-sm">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {children}
    </div>
  )
}
