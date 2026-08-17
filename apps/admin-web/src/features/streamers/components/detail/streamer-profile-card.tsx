import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"
import {
  Calendar,
  Clock,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { StreamerDetail } from "../../types"

interface ProfileField {
  icon: LucideIcon
  label: string
  value: string
}

function ProfileFieldRow({ icon: Icon, label, value }: ProfileField) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium text-foreground text-sm">{value}</p>
      </div>
    </div>
  )
}

export function StreamerProfileCard({
  streamer,
}: {
  streamer: StreamerDetail
}) {
  const fields: ProfileField[] = [
    { icon: Mail, label: "Email", value: streamer.email },
    { icon: Calendar, label: "Joined", value: streamer.joined },
    { icon: MapPin, label: "Location", value: streamer.location },
    {
      icon: Smartphone,
      label: "Primary device",
      value: streamer.primaryDevice,
    },
    { icon: Clock, label: "Last active", value: streamer.lastActive },
    { icon: ShieldCheck, label: "Plan", value: streamer.plan },
  ]

  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "py-6")}>
      <CardContent className="space-y-6 px-6">
        <h2 className="font-semibold text-foreground text-lg tracking-tight">
          Profile
        </h2>

        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {fields.map((field) => (
            <ProfileFieldRow key={field.label} {...field} />
          ))}
        </div>

        <div className="space-y-2.5">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Favorite genres
          </p>
          <div className="flex flex-wrap gap-2">
            {streamer.favoriteGenres.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No genre data yet.
              </p>
            ) : (
              streamer.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-foreground text-xs"
                >
                  <Heart
                    className="size-3.5 text-muted-foreground"
                    aria-hidden
                  />
                  {genre}
                </span>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
