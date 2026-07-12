import { SableLogoIcon } from "@/components/sable-logo-icon"
import { WORKSPACE_LIST } from "../../data/roles"
import { RolePickerCard } from "./role-picker-card"

export function RolePickerPage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="flex items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/50">
            <SableLogoIcon size="md" />
          </span>
          <span className="font-semibold text-base text-foreground tracking-tight">
            Sable TV
          </span>
        </div>
        <span className="text-muted-foreground text-xs">UX/UI Demo</span>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pt-6 pb-16 sm:px-10 lg:px-16">
        <div className="mb-8">
          <h1 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            Start Demo
          </h1>
          <p className="mt-1.5 text-muted-foreground text-sm">
            Pick the role you want to work as.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSPACE_LIST.map((config) => (
            <RolePickerCard key={config.id} config={config} />
          ))}
        </div>
      </main>
    </div>
  )
}
