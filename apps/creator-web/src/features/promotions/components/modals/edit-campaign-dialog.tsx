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
import {
  DEFAULT_ESTIMATED_REACH,
  PROMOTION_FORM_PROJECTS,
  PROMOTION_PLACEMENT_OPTIONS,
} from "../../constants"
import type { PromotionDetail } from "../../types"
import { EstimatedReachCard } from "../shared/estimated-reach-card"
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
  return (
    <PromotionModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit campaign"
      subtitle="Set where the ad runs, the budget, and the schedule."
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
            <Button type="button" variant="outline">
              Save draft
            </Button>
            <Button type="button" onClick={() => onOpenChange(false)}>
              Launch promotion
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
            defaultValue="Lagos Nights — Season 2 boost"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-creator">Creator</Label>
            <Input id="edit-creator" defaultValue="Ada Obi" />
          </div>
          <div className="space-y-2">
            <Label>Project / series</Label>
            <Select defaultValue="lagos-nights">
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Placement</Label>
            <Select defaultValue="home_banner">
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
          <div className="space-y-2">
            <Label htmlFor="edit-budget">Budget (₦)</Label>
            <Input id="edit-budget" defaultValue="250000" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-start">Start</Label>
            <Input id="edit-start" defaultValue={promotion.startDate} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-end">End</Label>
            <Input id="edit-end" defaultValue={promotion.endDate} />
          </div>
        </div>

        <EstimatedReachCard reach={DEFAULT_ESTIMATED_REACH} />
      </div>
    </PromotionModalShell>
  )
}
