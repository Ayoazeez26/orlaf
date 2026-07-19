import { randomBytes } from "node:crypto"
import { AccountType, AdminRole } from "@sable/contracts"
import { AccountService } from "./account.service"

export interface SuperAdminSeedInput {
  email: string
  password?: string
}

export interface SuperAdminSeedResult {
  created: boolean
  accountId?: string
  email: string
  /** Present only when a new account was created and no password was supplied in input. */
  generatedPassword?: string
}

export async function seedSuperAdmin(
  accountService: AccountService,
  input: SuperAdminSeedInput
): Promise<SuperAdminSeedResult> {
  const email = input.email.trim()
  if (!email) {
    throw new Error("SUPERADMIN_EMAIL is required")
  }

  const existing = await accountService.findByEmail(AccountType.ADMIN, email)
  if (existing) {
    return {
      created: false,
      accountId: existing.id,
      email: existing.email,
    }
  }

  const generatedPassword = input.password
    ? undefined
    : randomBytes(16).toString("hex")
  const password = input.password ?? generatedPassword!

  const account = await accountService.createAdmin({
    email,
    role: AdminRole.SUPER_ADMIN,
    password,
  })

  return {
    created: true,
    accountId: account.id,
    email: account.email,
    generatedPassword,
  }
}
