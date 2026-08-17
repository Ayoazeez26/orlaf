import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  AUDIT_ROLE_CLASS,
  AUDIT_ROLE_LABEL,
  auditActionConfig,
} from "../constants"
import type { AuditLogEntry } from "../types"

interface AuditLogTableProps {
  entries: AuditLogEntry[]
}

const HEAD_CLASS =
  "px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide"

export function AuditLogTable({ entries }: AuditLogTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center p-6 text-center text-muted-foreground text-sm">
        No audit entries match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-border border-b">
            <th className={HEAD_CLASS}>User</th>
            <th className={HEAD_CLASS}>Action</th>
            <th className={HEAD_CLASS}>Target</th>
            <th className={HEAD_CLASS}>Role</th>
            <th className={HEAD_CLASS}>Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const action = auditActionConfig(entry.action)
            const ActionIcon = action.icon

            return (
              <tr
                key={entry.id}
                className="border-border/60 border-b transition-colors last:border-0 hover:bg-muted/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs">
                      {entry.userInitials}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">
                        {entry.userName}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {entry.userEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium text-xs",
                      action.badgeClass
                    )}
                  >
                    <ActionIcon className="size-3.5" aria-hidden />
                    {action.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.target}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-medium text-sm capitalize",
                      AUDIT_ROLE_CLASS[entry.role]
                    )}
                  >
                    {AUDIT_ROLE_LABEL[entry.role]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {entry.time}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface AuditLogPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function AuditLogPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: AuditLogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>

        {pages.map((pageNumber) => {
          const isActive = pageNumber === page

          return (
            <Button
              key={pageNumber}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="icon"
              className="size-8"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          )
        })}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
