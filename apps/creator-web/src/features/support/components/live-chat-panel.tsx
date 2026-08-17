import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { MessageCircle, Send } from "lucide-react"
import { useState } from "react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/projects/constants/frosted-card"
import { SUPPORT_FIELD_CLASS } from "../constants"

interface ChatMessage {
  id: string
  fromAgent: boolean
  body: string
  time: string
}

const INTRO: ChatMessage[] = [
  {
    id: "m1",
    fromAgent: true,
    body: "Hi — I'm Ada from Sable Support. How can I help today?",
    time: "10:42",
  },
]

export function LiveChatPanel() {
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(INTRO)
  const [draft, setDraft] = useState("")

  if (!started) {
    return (
      <div
        className={cn(
          FROSTED_CARD_SURFACE_CLASS,
          "flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center"
        )}
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="size-7 text-primary" aria-hidden />
        </span>
        <div className="space-y-1">
          <h2 className="font-semibold text-foreground text-lg">
            Chat with a live agent
          </h2>
          <p className="text-muted-foreground text-sm">
            Average reply under 2 minutes. Available Mon–Fri, 9am–6pm WAT.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 text-emerald-600 text-sm dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          Agents online
        </p>
        <Button type="button" onClick={() => setStarted(true)}>
          Start chat
        </Button>
      </div>
    )
  }

  function send() {
    const trimmed = draft.trim()
    if (!trimmed) return
    const now = new Date()
    const time = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })
    setMessages((current) => [
      ...current,
      {
        id: `u-${current.length}`,
        fromAgent: false,
        body: trimmed,
        time,
      },
    ])
    setDraft("")
  }

  return (
    <div
      className={cn(
        FROSTED_CARD_SURFACE_CLASS,
        "flex min-h-[480px] flex-col overflow-hidden py-0"
      )}
    >
      <div className="flex items-center gap-3 border-border border-b px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 font-medium text-primary text-sm">
          A
        </span>
        <div>
          <p className="font-semibold text-foreground text-sm">
            Ada · Sable Support
          </p>
          <p className="inline-flex items-center gap-1.5 text-emerald-600 text-xs dark:text-emerald-400">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden
            />
            Online · typically replies in under 2 min
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col",
              message.fromAgent ? "items-start" : "items-end"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                message.fromAgent
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.body}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">{message.time}</p>
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-border border-t p-4"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          className={cn("h-11", SUPPORT_FIELD_CLASS)}
        />
        <Button type="submit" size="icon" className="size-11 rounded-full">
          <Send className="size-4" aria-hidden />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  )
}
