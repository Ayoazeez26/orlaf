import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import { useModalShell } from "./use-modal-shell"

const MODERATION_ACTIONS = [
  {
    id: "warning",
    label: "Send warning",
    description: "Notify the creator. No content removed.",
  },
  {
    id: "restrict",
    label: "Restrict visibility",
    description: "Hide from discovery but keep the page live.",
  },
  {
    id: "takedown",
    label: "Take down content",
    description: "Remove from the platform immediately.",
  },
  {
    id: "reviewed",
    label: "Mark as reviewed",
    description: "No violation found. Close any open reports.",
  },
] as const

type ModerationAction = (typeof MODERATION_ACTIONS)[number]["id"]

interface ProjectModerationActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  projectSubtitle?: string
  projectId?: string
  role?: WorkspaceRoleId
  onConfirm?: (action: ModerationAction, note: string) => void
}

export function ProjectModerationActionDialog({
  open,
  onOpenChange,
  projectTitle,
  projectSubtitle,
  projectId,
  role,
  onConfirm,
}: ProjectModerationActionDialogProps) {
  const [action, setAction] = useState<ModerationAction>("warning")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (open) {
      setAction("warning")
      setNote("")
    }
  }, [open])

  useModalShell(open, onOpenChange)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-moderation-action-title"
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="border-border border-b px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="project-moderation-action-title"
                className="font-semibold text-foreground text-lg"
              >
                Take moderation action
              </h2>
              {projectSubtitle ? (
                <p className="mt-1 text-muted-foreground text-sm">
                  {projectTitle} — {projectSubtitle}
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground text-sm">
                  {projectTitle}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            {MODERATION_ACTIONS.map((option) => {
              const isSelected = action === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAction(option.id)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <p className="font-medium text-foreground text-sm">
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-muted-foreground text-xs">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-moderation-note">Note (optional)</Label>
            <Textarea
              id="project-moderation-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Reference the policy or rationale for this action."
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-border border-t px-6 py-4">
          {projectId && role ? (
            <Button type="button" variant="ghost" asChild>
              <Link
                to="/workspace/$role/projects/$projectId"
                params={{ role, projectId }}
                onClick={() => onOpenChange(false)}
              >
                Open project
              </Link>
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm?.(action, note)
                onOpenChange(false)
              }}
            >
              Apply action
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
