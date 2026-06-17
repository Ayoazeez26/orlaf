import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import { BookOpen, Mail, MessageCircle } from "lucide-react"

/** Figma: #FFFFFF fill, 1px #E2E4EA border, dual drop shadow */
export const SUPPORT_FIELD_CLASS = cn(
  "rounded-xl border border-[#E2E4EA] bg-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
)

export interface SupportOption {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href?: string
}

export const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: "help-center",
    title: "Help center",
    description: "Guides, FAQs, and best practices for creators.",
    icon: BookOpen,
    href: "#",
  },
  {
    id: "live-chat",
    title: "Live chat",
    description: "Average reply in under 5 minutes.",
    icon: MessageCircle,
    href: "#",
  },
  {
    id: "email",
    title: "Email us",
    description: "creators@sable.tv — replies within 24h.",
    icon: Mail,
    href: "mailto:creators@sable.tv",
  },
]
