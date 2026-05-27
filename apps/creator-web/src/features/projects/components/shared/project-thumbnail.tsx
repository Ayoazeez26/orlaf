import { cn } from "@workspace/ui/lib/utils"

interface ProjectThumbnailProps {
  src: string
  alt: string
  variant?: "card" | "hero" | "row"
  className?: string
}

export function ProjectThumbnail({
  src,
  alt,
  variant = "card",
  className,
}: ProjectThumbnailProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "object-cover",
        variant === "card" && "aspect-[3/4] w-full rounded-xl",
        variant === "hero" && "aspect-[2/3] w-32 shrink-0 rounded-xl",
        variant === "row" && "size-14 shrink-0 rounded-lg",
        className
      )}
    />
  )
}
