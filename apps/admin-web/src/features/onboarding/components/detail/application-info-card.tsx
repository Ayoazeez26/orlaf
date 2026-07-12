import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { Calendar, FileText, Mail, MapPin, Tag, UserPlus } from "lucide-react"
import { FROSTED_CARD_SURFACE_CLASS } from "@/features/workspaces/lib/frosted-card"
import type { ApplicationDetail } from "../../types"

interface ApplicationInfoCardProps {
  application: ApplicationDetail
}

const FIELDS = [
  {
    key: "username",
    label: "Handle",
    icon: Tag,
    getValue: (application: ApplicationDetail) => application.username,
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    getValue: (application: ApplicationDetail) => application.email,
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    getValue: (application: ApplicationDetail) => application.location,
  },
  {
    key: "submitted",
    label: "Submitted",
    icon: Calendar,
    getValue: (application: ApplicationDetail) => application.submitted,
  },
  {
    key: "source",
    label: "Source",
    icon: UserPlus,
    getValue: (application: ApplicationDetail) => application.source,
  },
] as const

export function ApplicationInfoCard({ application }: ApplicationInfoCardProps) {
  return (
    <Card className={cn(FROSTED_CARD_SURFACE_CLASS, "h-full py-6")}>
      <CardHeader className="px-5 pb-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 font-semibold text-base">
          <FileText className="size-4 text-muted-foreground" aria-hidden />
          Application
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-5 sm:px-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {application.bio}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => {
            const Icon = field.icon

            return (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Icon className="size-3.5" aria-hidden />
                  {field.label}
                </div>
                <p className="font-medium text-foreground text-sm">
                  {field.getValue(application)}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
