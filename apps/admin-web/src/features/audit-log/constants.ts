import {
  Check,
  FileText,
  Flag,
  Layers,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  UserX,
} from "lucide-react"
import type { AuditActionType, AuditActorRole } from "./types"

export const AUDIT_PAGE_SIZE = 8

export const AUDIT_ACTION_FILTERS: {
  key: "all" | AuditActionType
  label: string
}[] = [
  { key: "all", label: "All actions" },
  { key: "series-published", label: "Series published" },
  { key: "series-rejected", label: "Series rejected" },
  { key: "user-suspended", label: "User suspended" },
  { key: "episode-published", label: "Episode published" },
  { key: "report-resolved", label: "Report resolved" },
  { key: "rail-updated", label: "Rail updated" },
  { key: "member-invited", label: "Member invited" },
]

export const AUDIT_ROLE_FILTERS: {
  key: "all" | AuditActorRole
  label: string
}[] = [
  { key: "all", label: "All roles" },
  { key: "admin", label: "Admin" },
]

const DEFAULT_ACTION = {
  label: "Action",
  icon: FileText,
  badgeClass: "bg-muted text-muted-foreground",
}

export const AUDIT_ACTION_CONFIG: Record<
  AuditActionType,
  { label: string; icon: typeof Plus; badgeClass: string }
> = {
  "series-published": {
    label: "Series Published",
    icon: Upload,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "series-rejected": {
    label: "Series Rejected",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "series-unpublished": {
    label: "Series Unpublished",
    icon: Settings,
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
  "series-deleted": {
    label: "Series Deleted",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "episode-published": {
    label: "Episode Published",
    icon: Upload,
    badgeClass: "bg-primary/10 text-primary",
  },
  "episode-rejected": {
    label: "Episode Rejected",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "creator-verified": {
    label: "Creator Verified",
    icon: UserCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "user-suspended": {
    label: "User Suspended",
    icon: UserX,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "user-reactivated": {
    label: "User Reactivated",
    icon: UserCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "creator-reactivated": {
    label: "Creator Reactivated",
    icon: UserCheck,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "application-approved": {
    label: "Application Approved",
    icon: Check,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "application-rejected": {
    label: "Application Rejected",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "report-created": {
    label: "Report Created",
    icon: Flag,
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
  "report-reviewed": {
    label: "Report Reviewed",
    icon: ShieldCheck,
    badgeClass: "bg-primary/10 text-primary",
  },
  "report-resolved": {
    label: "Report Resolved",
    icon: FileText,
    badgeClass: "bg-muted text-muted-foreground",
  },
  "report-dismissed": {
    label: "Report Dismissed",
    icon: FileText,
    badgeClass: "bg-muted text-muted-foreground",
  },
  "rail-created": {
    label: "Rail Created",
    icon: Plus,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "rail-updated": {
    label: "Rail Updated",
    icon: Layers,
    badgeClass: "bg-primary/10 text-primary",
  },
  "rail-deleted": {
    label: "Rail Deleted",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "member-invited": {
    label: "Member Invited",
    icon: Plus,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "member-role-changed": {
    label: "Role Changed",
    icon: Settings,
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
}

export function auditActionConfig(action: AuditActionType) {
  return AUDIT_ACTION_CONFIG[action] ?? DEFAULT_ACTION
}

export const AUDIT_ROLE_CLASS: Record<AuditActorRole, string> = {
  admin: "text-red-600",
}

export const AUDIT_ROLE_LABEL: Record<AuditActorRole, string> = {
  admin: "Admin",
}
