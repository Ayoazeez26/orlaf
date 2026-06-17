import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { LifeBuoy } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { SUPPORT_FIELD_CLASS } from "../constants"

export function SupportTicketForm() {
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubject("")
    setCategory("")
    setDescription("")
  }

  return (
    <Card className={FROSTED_CARD_SURFACE_CLASS}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <LifeBuoy
            className="size-4 text-primary"
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <p className="font-semibold text-foreground">Open a support ticket</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="What do you need help with?"
                className={cn("h-10 w-full", SUPPORT_FIELD_CLASS)}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <Label htmlFor="support-category">Category</Label>
              <Input
                id="support-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Payouts, Uploads, Promotions"
                className={cn("h-10 w-full", SUPPORT_FIELD_CLASS)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-description">Describe the issue</Label>
            <Textarea
              id="support-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell us a bit more..."
              className={cn("min-h-28", SUPPORT_FIELD_CLASS)}
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit">Submit ticket</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
