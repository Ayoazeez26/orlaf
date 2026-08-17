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
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, toastMutationError } from "@/lib/toast"
import {
  PROMOTION_AUDIENCE_OPTIONS,
  PROMOTION_GOAL_OPTIONS,
  PROMOTION_PLACEMENT_OPTIONS,
} from "../../constants"
import { usePromotionProjects } from "../../hooks/use-promotion-projects"
import {
  useSubmitPromotion,
  useUpdatePromotion,
} from "../../hooks/use-promotions"
import type {
  PromotionAudience,
  PromotionDetail,
  PromotionGoal,
  PromotionPlacement,
} from "../../types"
import { PromotionModalShell } from "./promotion-modal-shell"

interface EditCampaignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion: PromotionDetail
}

export function EditCampaignDialog({
  open,
  onOpenChange,
  promotion,
}: EditCampaignDialogProps) {
  const updatePromotion = useUpdatePromotion(promotion.id)
  const submitPromotion = useSubmitPromotion(promotion.id)
  const { data: projects = [] } = usePromotionProjects()

  const [title, setTitle] = useState(promotion.title)
  const [seriesId, setSeriesId] = useState(promotion.seriesId)
  const [goal, setGoal] = useState<PromotionGoal>(promotion.goal)
  const [placement, setPlacement] = useState<PromotionPlacement>(
    promotion.placement
  )
  const [audience, setAudience] = useState<PromotionAudience>(
    promotion.audience
  )
  const [budget, setBudget] = useState(String(promotion.budget))
  const [duration, setDuration] = useState("14")

  useEffect(() => {
    if (!open) return
    setTitle(promotion.title)
    setSeriesId(promotion.seriesId)
    setGoal(promotion.goal)
    setPlacement(promotion.placement)
    setAudience(promotion.audience)
    setBudget(String(promotion.budget))
  }, [open, promotion])

  const isPending = updatePromotion.isPending || submitPromotion.isPending

  async function handleSave(submit: boolean) {
    const budgetValue = Number(budget)
    const durationValue = Number(duration)

    if (
      !title.trim() ||
      !seriesId ||
      !Number.isFinite(budgetValue) ||
      budgetValue < 1
    ) {
      toast.error("Enter a title, project, and budget of at least $1.")
      return
    }

    try {
      await updatePromotion.mutateAsync({
        title: title.trim(),
        seriesId,
        goal,
        placement,
        audience,
        budget: budgetValue,
        durationDays: durationValue,
      })

      if (submit) {
        await submitPromotion.mutateAsync()
        toast.success("Promotion submitted for review.")
      } else {
        toast.success("Draft saved.")
      }

      onOpenChange(false)
    } catch (error) {
      toastMutationError(error, "Unable to save promotion.")
    }
  }

  return (
    <PromotionModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit campaign"
      subtitle="Update placement, budget, and schedule."
      className="max-w-xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => void handleSave(false)}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              Save draft
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => void handleSave(true)}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              Submit for review
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="edit-campaign-title">Campaign title</Label>
          <Input
            id="edit-campaign-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Project / series</Label>
          <Select value={seriesId} onValueChange={setSeriesId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Goal</Label>
            <Select
              value={goal}
              onValueChange={(value) => setGoal(value as PromotionGoal)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMOTION_GOAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Placement</Label>
            <Select
              value={placement}
              onValueChange={(value) =>
                setPlacement(value as PromotionPlacement)
              }
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
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Audience</Label>
            <Select
              value={audience}
              onValueChange={(value) => setAudience(value as PromotionAudience)}
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
          <div className="space-y-2">
            <Label htmlFor="edit-budget">Budget (USD)</Label>
            <Input
              id="edit-budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-duration">Duration (days)</Label>
          <Input
            id="edit-duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
        </div>
      </div>
    </PromotionModalShell>
  )
}
