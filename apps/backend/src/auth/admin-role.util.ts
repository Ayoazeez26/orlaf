import { AdminRole } from "@sable/contracts"
import { AdminRole as PrismaAdminRole } from "src/generated/prisma/client"

export function toContractAdminRole(
  role: PrismaAdminRole | string | null | undefined
): AdminRole | null {
  if (!role) return null
  return role as AdminRole
}
