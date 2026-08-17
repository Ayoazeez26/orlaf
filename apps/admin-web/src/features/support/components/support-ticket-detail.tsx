import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { Send, Wrench } from "lucide-react"
import { useState } from "react"
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_BADGE_CLASS,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_BADGE_CLASS,
  TICKET_STATUS_LABEL,
  TICKET_STATUS_OPTIONS,
  TICKET_USER_TYPE_LABEL,
} from "../constants"
import type { SupportTicket, TicketStatus } from "../types"

interface SupportTicketDetailProps {
  ticket: SupportTicket | null
  onStatusChange: (status: TicketStatus) => void
  onSendReply: (message: string) => void
}

export function SupportTicketDetail({
  ticket,
  onStatusChange,
  onSendReply,
}: SupportTicketDetailProps) {
  const [reply, setReply] = useState("")

  if (!ticket) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center p-6 text-center text-muted-foreground text-sm">
        Select a ticket to view the conversation.
      </div>
    )
  }

  function handleSend() {
    const trimmed = reply.trim()
    if (!trimmed) return
    onSendReply(trimmed)
    setReply("")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-sm">
              {ticket.userInitials}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">
                  {ticket.userName}
                </p>
                <span className="text-muted-foreground text-sm">
                  {TICKET_USER_TYPE_LABEL[ticket.userType]}
                </span>
                {ticket.priority !== "normal" ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium text-xs",
                      TICKET_PRIORITY_BADGE_CLASS[ticket.priority]
                    )}
                  >
                    {TICKET_PRIORITY_LABEL[ticket.priority]}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 font-medium text-xs",
                    TICKET_STATUS_BADGE_CLASS[ticket.status]
                  )}
                >
                  {TICKET_STATUS_LABEL[ticket.status]}
                </span>
              </div>
              <p className="mt-0.5 text-muted-foreground text-sm">
                {ticket.userEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h2 className="font-semibold text-foreground text-lg tracking-tight">
            {ticket.subject}
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
            <span>{ticket.reference}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              {ticket.category === "technical" ? (
                <Wrench className="size-3.5" aria-hidden />
              ) : null}
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </span>
            <span>·</span>
            <span>Opened {ticket.openedAt}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isAdmin ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.isAdmin
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <p className="mb-1 font-medium text-xs opacity-80">
                {message.author} · {message.timestamp}
              </p>
              <p className="text-sm leading-relaxed">{message.body}</p>
              {message.attachments?.length ? (
                <ul className="mt-2 space-y-1">
                  {message.attachments.map((attachment) => (
                    <li key={attachment.id}>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline underline-offset-2 opacity-90 hover:opacity-100"
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

      <div className="space-y-4 border-border border-t p-5">
        <div className="flex flex-wrap items-center gap-1">
          {TICKET_STATUS_OPTIONS.map((status) => {
            const isActive = ticket.status === status

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {TICKET_STATUS_LABEL[status]}
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          <Textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Type your reply..."
            rows={3}
            className="resize-none"
          />
          <Button
            type="button"
            className="gap-2"
            onClick={handleSend}
            disabled={!reply.trim()}
          >
            <Send className="size-4" aria-hidden />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
