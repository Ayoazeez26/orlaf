import { cn } from "@workspace/ui/lib/utils"

/** Decorative thumbnail; the series title is always shown next to it. */
export function SeriesPoster({
  posterUrl,
  className,
}: {
  posterUrl: string | null
  className?: string
}) {
  if (posterUrl) {
    return (
      <img
        src={posterUrl}
        alt=""
        loading="lazy"
        className={cn(
          "h-12 w-9 shrink-0 rounded-md bg-muted object-cover",
          className
        )}
      />
    )
  }
  return (
    <div
      className={cn(
        "h-12 w-9 shrink-0 rounded-md bg-gradient-to-br from-primary/25 to-primary/5",
        className
      )}
    />
  )
}
