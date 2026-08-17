import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft, Paperclip } from "lucide-react"
import { useRef, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { toast, toastMutationError } from "@/lib/toast"
import { uploadSupportAttachments } from "../api/support-api"
import { useCreateCreatorTicket } from "../api/support-hooks"
import {
  priorityToApi,
  SUPPORT_FIELD_CLASS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_TOPIC_OPTIONS,
  topicToCategory,
} from "../constants"
import type { TicketPriorityChoice, TicketTopic } from "../types"

interface NewTicketFormProps {
  onBack: () => void
  onCreated: (ticketId: string) => void
}

export function NewTicketForm({ onBack, onCreated }: NewTicketFormProps) {
  const createTicket = useCreateCreatorTicket()
  const fileRef = useRef<HTMLInputElement>(null)
  const [topic, setTopic] = useState<TicketTopic>("payouts")
  const [priority, setPriority] = useState<TicketPriorityChoice>("normal")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!subject.trim() || !description.trim()) return
    setIsUploading(true)
    try {
      const attachments =
        files.length > 0 ? await uploadSupportAttachments(files) : undefined
      const ticket = await createTicket.mutateAsync({
        subject: subject.trim(),
        description: description.trim(),
        category: topicToCategory(topic),
        priority: priorityToApi(priority),
        attachments,
      })
      toast.success("Ticket submitted")
      onCreated(ticket.id)
    } catch (error) {
      toastMutationError(error, "Could not submit ticket")
    } finally {
      setIsUploading(false)
    }
  }

  const busy = createTicket.isPending || isUploading

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back
      </button>

      <form
        onSubmit={handleSubmit}
        className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-6 p-6")}
      >
        <div className="space-y-2">
          <Label>Topic</Label>
          <div className="flex flex-wrap gap-2">
            {TICKET_TOPIC_OPTIONS.map((option) => {
              const isActive = option.id === topic
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTopic(option.id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 font-medium text-sm transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <div className="inline-flex overflow-hidden rounded-xl border border-border">
            {TICKET_PRIORITY_OPTIONS.map((option) => {
              const isActive = option.id === priority
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPriority(option.id)}
                  className={cn(
                    "px-4 py-2 font-medium text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-subject">Subject</Label>
          <Input
            id="ticket-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="e.g. Payout not received for May"
            className={cn("h-10", SUPPORT_FIELD_CLASS)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-description">Describe the issue</Label>
          <Textarea
            id="ticket-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Include dates, transaction IDs, or screenshots if relevant..."
            className={cn("min-h-32", SUPPORT_FIELD_CLASS)}
          />
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain"
            className="hidden"
            onChange={(event) => {
              setFiles(Array.from(event.target.files ?? []).slice(0, 5))
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          >
            <Paperclip className="size-4" aria-hidden />
            Attach files
          </button>
          {files.length > 0 ? (
            <p className="text-muted-foreground text-xs">
              {files.map((file) => file.name).join(", ")}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Submitting…" : "Submit ticket"}
        </Button>
      </form>
    </div>
  )
}
