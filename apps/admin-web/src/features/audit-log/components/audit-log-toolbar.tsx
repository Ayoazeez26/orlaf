import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Filter, Search, Shield } from "lucide-react"
import { AUDIT_ACTION_FILTERS, AUDIT_ROLE_FILTERS } from "../constants"
import type { AuditActionFilter, AuditRoleFilter } from "../types"

interface AuditLogToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  actionFilter: AuditActionFilter
  onActionFilterChange: (value: AuditActionFilter) => void
  roleFilter: AuditRoleFilter
  onRoleFilterChange: (value: AuditRoleFilter) => void
}

export function AuditLogToolbar({
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  roleFilter,
  onRoleFilterChange,
}: AuditLogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by user, target, or action..."
          aria-label="Search audit log"
          className="h-9 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={actionFilter}
          onValueChange={(value) =>
            onActionFilterChange(value as AuditActionFilter)
          }
        >
          <SelectTrigger className="h-9 w-[160px] gap-2">
            <Filter
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ACTION_FILTERS.map((filter) => (
              <SelectItem key={filter.key} value={filter.key}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={roleFilter}
          onValueChange={(value) =>
            onRoleFilterChange(value as AuditRoleFilter)
          }
        >
          <SelectTrigger className="h-9 w-[140px] gap-2">
            <Shield
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ROLE_FILTERS.map((filter) => (
              <SelectItem key={filter.key} value={filter.key}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
