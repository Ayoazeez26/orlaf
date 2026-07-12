import { cn } from "@workspace/ui/lib/utils"

export type OnboardingView = "applications" | "invites"

interface OnboardingViewToggleProps {
  active: OnboardingView
  onChange: (view: OnboardingView) => void
}

const VIEWS: { key: OnboardingView; label: string }[] = [
  { key: "applications", label: "Applications" },
  { key: "invites", label: "Invites" },
]

export function OnboardingViewToggle({
  active,
  onChange,
}: OnboardingViewToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
      {VIEWS.map((view) => {
        const isActive = view.key === active

        return (
          <button
            key={view.key}
            type="button"
            onClick={() => onChange(view.key)}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium text-sm transition-colors",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {view.label}
          </button>
        )
      })}
    </div>
  )
}
