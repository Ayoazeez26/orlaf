import { useNavigate } from "@tanstack/react-router"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Check, X } from "lucide-react"
import type { WorkspaceRoleId } from "@/features/workspaces/types"
import type { OnboardingApplication } from "../types"
import { ApplicationStatusBadge } from "./onboarding-badges"

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

interface ApplicationsTableProps {
  applications: OnboardingApplication[]
  role: WorkspaceRoleId
}

export function ApplicationsTable({
  applications,
  role,
}: ApplicationsTableProps) {
  const navigate = useNavigate()

  function openDetail(applicationId: string) {
    navigate({
      to: "/workspace/$role/onboarding/$applicationId",
      params: { role, applicationId },
    })
  }

  if (applications.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No applications match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>Applicant</th>
            <th className={HEAD_CLASS}>Location</th>
            <th className={HEAD_CLASS}>Source</th>
            <th className={HEAD_CLASS}>Submitted</th>
            <th className={HEAD_CLASS}>Status</th>
            <th className={HEAD_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr
              key={application.id}
              onClick={() => openDetail(application.id)}
              className="cursor-pointer border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-primary/15 font-medium text-primary text-xs">
                      {application.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {application.name}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {application.email}
                    </p>
                    <p className="truncate text-muted-foreground text-xs">
                      {application.username}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {application.location}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {application.source}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {application.submitted}
              </td>
              <td className="px-4 py-3">
                <ApplicationStatusBadge status={application.status} />
              </td>
              <td
                className="px-4 py-3"
                onMouseDown={(event) => event.stopPropagation()}
              >
                {application.status === "pending" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5"
                      onClick={() => openDetail(application.id)}
                    >
                      <Check className="size-3.5" aria-hidden />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/5"
                      onClick={() => openDetail(application.id)}
                    >
                      <X className="size-3.5" aria-hidden />
                      Reject
                    </Button>
                  </div>
                ) : null}
                {application.status === "approved" ? (
                  <span className="text-muted-foreground text-sm">
                    Onboarded
                  </span>
                ) : null}
                {application.status === "rejected" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openDetail(application.id)}
                  >
                    Reopen
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
