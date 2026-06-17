import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { Eye, LineChart, Users } from "lucide-react"
import { useState } from "react"
import {
  DEFAULT_ESTIMATED_REACH,
  PROMOTION_AUDIENCE_OPTIONS,
  PROMOTION_FORM_PROJECTS,
  PROMOTION_GOAL_OPTIONS,
  PROMOTION_PLACEMENT_OPTIONS,
} from "../../constants"
import type {
  PromotionAudience,
  PromotionGoal,
  PromotionPlacement,
} from "../../types"
import { EstimatedReachCard } from "../shared/estimated-reach-card"
import { PromotionModalShell } from "./promotion-modal-shell"

const GOAL_ICONS = {
  views: Eye,
  subscribers: Users,
  watch_time: LineChart,
} as const

interface NewPromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPromotionDialog({
  open,
  onOpenChange,
}: NewPromotionDialogProps) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("Premiere Boost — Lagos After Dark")
  const [projectId, setProjectId] = useState("lagos-after-dark")
  const [goal, setGoal] = useState<PromotionGoal>("views")
  const [placement, setPlacement] = useState<PromotionPlacement>("home_banner")
  const [audience, setAudience] = useState<PromotionAudience>("all_viewers")
  const [budget, setBudget] = useState("50")
  const [duration, setDuration] = useState("14")

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setStep(1)
    }
    onOpenChange(nextOpen)
  }

  return (
    <PromotionModalShell
      open={open}
      onOpenChange={handleClose}
      title="New promotion"
      step={
        step === 1
          ? { current: 1, total: 2, label: "Basics" }
          : { current: 2, total: 2, label: "Placement, Budget & schedule" }
      }
      footer={
        step === 1 ? (
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline">
                Save draft
              </Button>
              <Button type="button" onClick={() => handleClose(false)}>
                Launch promotion
              </Button>
            </div>
          </div>
        )
      }
    >
      {step === 1 ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="promotion-title">Promotion title</Label>
            <Input
              id="promotion-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMOTION_FORM_PROJECTS.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Goal</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {PROMOTION_GOAL_OPTIONS.map((option) => {
                const Icon = GOAL_ICONS[option.value]
                const selected = goal === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGoal(option.value)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                      selected
                        ? "border-payout-schedule-selected-border bg-payout-schedule-selected-bg"
                        : "border-border bg-card hover:border-payout-schedule-selected-border/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5",
                        selected ? "text-primary" : "text-muted-foreground"
                      )}
                      aria-hidden
                    />
                    <span className="font-semibold text-foreground text-sm">
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Placement</Label>
            <Select
              value={placement}
              onValueChange={(v) => setPlacement(v as PromotionPlacement)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMOTION_PLACEMENT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Where viewers will see your promotion across Sable TV.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Audience</Label>
            <Select
              value={audience}
              onValueChange={(v) => setAudience(v as PromotionAudience)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMOTION_AUDIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="promotion-budget">Total budget (USD)</Label>
              <Input
                id="promotion-budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promotion-duration">Duration (days)</Label>
              <Input
                id="promotion-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <EstimatedReachCard reach={DEFAULT_ESTIMATED_REACH} />
        </div>
      )}
    </PromotionModalShell>
  )
}
