import type {
  AuditActionType,
  AuditActorRole,
  AuditLogEntry,
} from "@sable/contracts"

export type { AuditActionType, AuditActorRole, AuditLogEntry }
export type AuditActionFilter = "all" | AuditActionType
export type AuditRoleFilter = "all" | AuditActorRole
