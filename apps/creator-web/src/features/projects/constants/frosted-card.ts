import { cn } from "@workspace/ui/lib/utils"

/** Figma: 16px radius, 24px padding, #FFFFFF 80%, 24px backdrop blur, 1px border */
export const FROSTED_CARD_CLASS = cn(
  "rounded-[16px] border bg-surface-frosted p-6 shadow-none backdrop-blur-[24px]"
)

/** For shadcn Card wrappers that manage their own padding */
export const FROSTED_CARD_SURFACE_CLASS = cn(
  "rounded-[16px] border bg-surface-frosted shadow-none backdrop-blur-[24px]"
)
