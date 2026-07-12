import { Button } from "@workspace/ui/components/button"
import { Save } from "lucide-react"

export function SettingsPageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Configure how Sable TV runs — platform rules, integrations, team and
          security.
        </p>
      </div>
      <Button type="button" className="shrink-0 gap-2">
        <Save className="size-4" aria-hidden />
        Save changes
      </Button>
    </div>
  )
}
