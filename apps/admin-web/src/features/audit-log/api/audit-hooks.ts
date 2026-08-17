import type { AuditLogListQuery } from "@sable/contracts"
import { useQuery } from "@tanstack/react-query"
import { listAuditLog } from "./audit-api"

export const auditKeys = {
  all: ["admin", "audit"] as const,
  list: (params: AuditLogListQuery) =>
    [...auditKeys.all, "list", params] as const,
}

export function useAuditLogQuery(params: AuditLogListQuery) {
  return useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => listAuditLog(params),
    placeholderData: (prev) => prev,
  })
}
