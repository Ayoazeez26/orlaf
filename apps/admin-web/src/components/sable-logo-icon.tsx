import { cn } from "@workspace/ui/lib/utils"
import { useBranding } from "@/features/branding/use-branding"

interface SableLogoIconProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const SIZE_CLASS = {
  sm: "h-9 min-w-9",
  md: "h-11 min-w-11",
  lg: "h-14 min-w-14",
} as const

export function SableLogoIcon({ className, size = "md" }: SableLogoIconProps) {
  const sizeClass = SIZE_CLASS[size]
  const { logoUrl } = useBranding()

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        aria-hidden
        className={cn("w-auto shrink-0 object-contain", sizeClass, className)}
      />
    )
  }

  return (
    <>
      <img
        src="/images/sable-logo.png"
        alt=""
        aria-hidden
        className={cn(
          "w-auto shrink-0 object-contain dark:hidden",
          sizeClass,
          className
        )}
      />
      <img
        src="/images/sable-logo-white.png"
        alt=""
        aria-hidden
        className={cn(
          "hidden w-auto shrink-0 object-contain dark:block",
          sizeClass,
          className
        )}
      />
    </>
  )
}
