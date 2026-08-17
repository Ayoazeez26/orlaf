import type { SupportTicket } from "@sable/contracts"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft, Mail, Paperclip, Send } from "lucide-react"
import { useRef, useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { toast, toastMutationError } from "@/lib/toast"
import { uploadSupportAttachments } from "../api/support-api"
import {
  useReplyCreatorTicket,
  useUpdateCreatorTicket,
} from "../api/support-hooks"
import {
  SUPPORT_FIELD_CLASS,
  TICKET_CATEGORY_LABEL,
  TICKET_STATUS_BADGE_CLASS,
  TICKET_STATUS_LABEL,
} from "../constants"

interface TicketDetailPanelProps {
  ticket: SupportTicket
  onBack: () => void
}

export function TicketDetailPanel({ ticket, onBack }: TicketDetailPanelProps) {
  const replyTicket = useReplyCreatorTicket()
  const updateTicket = useUpdateCreatorTicket()
  const fileRef = useRef<HTMLInputElement>(null)
  const [reply, setReply] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  async function handleSend() {
    const trimmed = reply.trim()
    if (!trimmed) return
    setIsUploading(true)
    try {
      const attachments =
        files.length > 0 ? await uploadSupportAttachments(files) : undefined
      await replyTicket.mutateAsync({
        id: ticket.id,
        body: { body: trimmed, attachments },
      })
      setReply("")
      setFiles([])
      if (fileRef.current) fileRef.current.value = ""
      toast.success("Reply sent")
    } catch (error) {
      toastMutationError(error, "Could not send reply")
    } finally {
      setIsUploading(false)
    }
  }

  function handleResolve() {
    void updateTicket
      .mutateAsync({ id: ticket.id, body: { status: "resolved" } })
      .then(() => toast.success("Ticket marked resolved"))
      .catch((error) => toastMutationError(error, "Could not update ticket"))
  }

  const busy = replyTicket.isPending || isUploading

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        All tickets
      </button>

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-3 p-5")}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            {ticket.reference} · Created {ticket.openedAt}
          </p>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-medium text-xs",
              TICKET_STATUS_BADGE_CLASS[ticket.status]
            )}
          >
            {TICKET_STATUS_LABEL[ticket.status]}
          </span>
        </div>
        <h2 className="font-semibold text-xl tracking-tight">
          {ticket.subject}
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground text-xs">
            {TICKET_CATEGORY_LABEL[ticket.category]}
          </span>
          {ticket.priority === "urgent" || ticket.priority === "high" ? (
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-destructive text-xs">
              {ticket.priority === "urgent" ? "Urgent" : "High"} priority
            </span>
          ) : null}
        </div>
      </div>

      <div className={cn(FROSTED_CARD_SURFACE_CLASS, "space-y-5 p-5")}>
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Conversation
        </p>
        <div className="space-y-5">
          {ticket.messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full font-medium text-sm",
                  message.isAdmin
                    ? "bg-primary/15 text-primary"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.isAdmin ? "S" : "Y"}
              </span>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="font-semibold text-foreground text-sm">
                    {message.isAdmin
                      ? `${message.author} · Sable Support`
                      : "You"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {message.timestamp}
                  </p>
                </div>
                <p className="text-foreground text-sm leading-6">
                  {message.body}
                </p>
                {message.attachments?.length ? (
                  <ul className="space-y-1 pt-1">
                    {message.attachments.map((attachment) => (
                      <li key={attachment.id}>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary text-sm underline-offset-2 hover:underline"
                        >
                          {attachment.fileName}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {ticket.status === "resolved" || ticket.status === "closed" ? null : (
          <div className="space-y-3 pt-2">
            <Textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Write a reply..."
              className={cn("min-h-24", SUPPORT_FIELD_CLASS)}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
              >
                <Paperclip className="size-4" aria-hidden />
                {files.length > 0
                  ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
                  : "Attach files"}
              </button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResolve}
                  disabled={updateTicket.isPending}
                >
                  Mark resolved
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handleSend}
                  disabled={busy}
                >
                  <Send className="size-4" aria-hidden />
                  Send reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="inline-flex items-center gap-2 text-muted-foreground text-xs">
        <Mail className="size-3.5" aria-hidden />
        Updates also go to your email on file.
      </p>
    </div>
  )
}
