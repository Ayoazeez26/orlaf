import { Button } from "@workspace/ui/components/button"
import { RotateCcw } from "lucide-react"
import {
  triggerSettingsReset,
  triggerSettingsSave,
} from "../lib/settings-form-actions"

export function SettingsPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="font-bold text-2xl text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage your studio, payouts, and preferences
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={() => triggerSettingsReset()}
        >
          <RotateCcw className="size-4" aria-hidden />
          Reset
        </Button>
        <Button
          type="button"
          className="rounded-xl"
          onClick={() => triggerSettingsSave()}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}
