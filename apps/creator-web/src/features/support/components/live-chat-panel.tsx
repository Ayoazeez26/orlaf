import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2, MessageCircle } from "lucide-react"
import { useAuth } from "@/features/auth/auth-context"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { identifyTawkVisitor, openTawkChat, useTawkStatus } from "@/lib/tawk"

interface LiveChatPanelProps {
  onOpenTicket: () => void
}

function ChatState({
  icon,
  iconBg = "bg-muted",
  title,
  body,
  action,
}: {
  icon: React.ReactNode
  iconBg?: string
  title: string
  body: string
  action: React.ReactNode
}) {
  return (
    <div
      className={cn(
        FROSTED_CARD_SURFACE_CLASS,
        "flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center"
      )}
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-full",
          iconBg
        )}
      >
        {icon}
      </span>
      <div className="space-y-1">
        <h2 className="font-semibold text-foreground text-lg">{title}</h2>
        <p className="max-w-sm text-muted-foreground text-sm">{body}</p>
      </div>
      {action}
    </div>
  )
}

/**
 * Only shows "start chat" when an agent is genuinely online (Tawk_API status
 * "online") — "away"/"offline" fall back to the ticket flow instead of
 * Tawk's own offline form, so every message lands in one admin inbox.
 */
export function LiveChatPanel({ onOpenTicket }: LiveChatPanelProps) {
  const { session } = useAuth()
  const status = useTawkStatus()

  if (status === "loading") {
    return (
      <ChatState
        icon={
          <Loader2
            className="size-7 animate-spin text-muted-foreground"
            aria-hidden
          />
        }
        title="Checking availability…"
        body="One moment while we check if an agent is online."
        action={null}
      />
    )
  }

  if (status !== "online") {
    return (
      <ChatState
        icon={
          <MessageCircle className="size-7 text-muted-foreground" aria-hidden />
        }
        title="Live chat isn't available right now"
        body="Send us a message instead and our support team will get back to you as soon as they can."
        action={
          <Button type="button" onClick={onOpenTicket}>
            Send a message
          </Button>
        }
      />
    )
  }

  const handleStart = () => {
    if (session?.email) {
      identifyTawkVisitor({
        name: session.display_name ?? session.email,
        email: session.email,
      })
    }
    openTawkChat()
  }

  return (
    <ChatState
      icon={<MessageCircle className="size-7 text-primary" aria-hidden />}
      iconBg="bg-primary/10"
      title="Chat with a live agent"
      body="An agent is online now and ready to help."
      action={
        <Button type="button" onClick={handleStart}>
          Start chat
        </Button>
      }
    />
  )
}
