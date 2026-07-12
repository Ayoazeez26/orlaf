import {
  Check,
  FileText,
  Flag,
  Plus,
  Settings,
  Trash2,
  Upload,
  UserX,
} from "lucide-react"
import type { AuditActionType, AuditActorRole } from "./types"

export const AUDIT_PAGE_SIZE = 8

export const AUDIT_ACTION_FILTERS: {
  key: "all" | AuditActionType
  label: string
}[] = [
  { key: "all", label: "All actions" },
  { key: "series-created", label: "Series created" },
  { key: "payout-approved", label: "Payout approved" },
  { key: "user-suspended", label: "User suspended" },
  { key: "episode-deleted", label: "Episode deleted" },
  { key: "episode-published", label: "Episode published" },
  { key: "content-flagged", label: "Content flagged" },
  { key: "settings-changed", label: "Settings changed" },
  { key: "report-resolved", label: "Report resolved" },
]

export const AUDIT_ROLE_FILTERS: {
  key: "all" | AuditActorRole
  label: string
}[] = [
  { key: "all", label: "All roles" },
  { key: "creator", label: "Creator" },
  { key: "admin", label: "Admin" },
  { key: "viewer", label: "Viewer" },
]

export const AUDIT_ACTION_CONFIG: Record<
  AuditActionType,
  { label: string; icon: typeof Plus; badgeClass: string }
> = {
  "series-created": {
    label: "Series Created",
    icon: Plus,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "payout-approved": {
    label: "Payout Approved",
    icon: Check,
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  "user-suspended": {
    label: "User Suspended",
    icon: UserX,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "episode-deleted": {
    label: "Episode Deleted",
    icon: Trash2,
    badgeClass: "bg-red-500/10 text-red-600",
  },
  "episode-published": {
    label: "Episode Published",
    icon: Upload,
    badgeClass: "bg-primary/10 text-primary",
  },
  "content-flagged": {
    label: "Content Flagged",
    icon: Flag,
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
  "settings-changed": {
    label: "Settings Changed",
    icon: Settings,
    badgeClass: "bg-amber-500/10 text-amber-600",
  },
  "report-resolved": {
    label: "Report Resolved",
    icon: FileText,
    badgeClass: "bg-muted text-muted-foreground",
  },
}

export const AUDIT_ROLE_CLASS: Record<AuditActorRole, string> = {
  creator: "text-primary",
  admin: "text-red-600",
  viewer: "text-muted-foreground",
}

export const AUDIT_ROLE_LABEL: Record<AuditActorRole, string> = {
  creator: "Creator",
  admin: "Admin",
  viewer: "Viewer",
}
