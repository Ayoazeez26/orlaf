import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common"
import {
  AccountType,
  type AdminPasswordChangeRequest,
  type AdminSessionResponse,
  type AdminSignInRequest,
  type AdminSignInResponse,
  SignInErrorCode,
} from "@sable/contracts"
import { PrismaService } from "../prisma/prisma.service"
import { AccountService } from "./account.service"
import { toContractAdminRole } from "./admin-role.util"
import { AuthService } from "./auth.service"
import { RefreshTokenService } from "./refresh-token.service"

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async signIn(
    input: AdminSignInRequest
  ): Promise<{ response: AdminSignInResponse; refreshToken: string }> {
    const account = await this.accountService.findByEmail(
      AccountType.ADMIN,
      input.email
    )

    if (!account?.passwordHash) {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.INVALID_CREDENTIALS,
        message: "Invalid email or password.",
      })
    }

    const passwordValid = await this.accountService.verifyPassword(
      input.password,
      account.passwordHash
    )

    if (!passwordValid) {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.INVALID_CREDENTIALS,
        message: "Invalid email or password.",
      })
    }

    if (account.status === "suspended") {
      throw new UnauthorizedException({
        error_code: SignInErrorCode.ACCOUNT_SUSPENDED,
        message: "This account has been suspended.",
      })
    }

    if (account.status !== "active") {
      throw new ForbiddenException({
        error_code: "ADMIN_ACCOUNT_INACTIVE",
        message: "This admin account is not active.",
      })
    }

    const role = toContractAdminRole(account.adminRole)
    if (!role) {
      throw new ForbiddenException({
        error_code: "ADMIN_ROLE_MISSING",
        message: "This admin account has no role assigned.",
      })
    }

    const accessToken = this.authService.issueAccessToken({
      account_id: account.id,
      account_type: AccountType.ADMIN,
      role,
    })

    const refreshToken = await this.refreshTokenService.issueRefreshToken({
      account_id: account.id,
      device_label: "admin-web",
      ttl_seconds: 7 * 24 * 60 * 60,
    })

    this.logger.log({
      event: "admin_sign_in_success",
      account_id: account.id,
      admin_role: role,
      must_change_password: account.mustChangePassword,
    })

    return {
      response: {
        access_token: accessToken,
        refresh_token: refreshToken,
        role,
        must_change_password: account.mustChangePassword,
        admin: {
          id: account.id,
          email: account.email,
          display_name: account.displayName,
        },
      },
      refreshToken,
    }
  }

  async changePassword(
    accountId: string,
    input: AdminPasswordChangeRequest
  ): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: {
        accountType: true,
        passwordHash: true,
      },
    })

    if (account?.accountType !== "admin") {
      throw new ForbiddenException("Only admin accounts can use this endpoint.")
    }

    if (!account.passwordHash) {
      throw new BadRequestException(
        "No password is set for this admin account."
      )
    }

    const currentValid = await this.accountService.verifyPassword(
      input.currentPassword,
      account.passwordHash
    )

    if (!currentValid) {
      throw new UnauthorizedException("Current password is incorrect.")
    }

    if (input.currentPassword === input.newPassword) {
      throw new BadRequestException(
        "New password must be different from your current password."
      )
    }

    const passwordHash = await this.accountService.hashPassword(
      input.newPassword
    )

    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    })

    this.logger.log({
      event: "admin_password_changed",
      account_id: accountId,
    })
  }

  async getSession(accountId: string): Promise<AdminSessionResponse> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: {
        accountType: true,
        email: true,
        displayName: true,
        mustChangePassword: true,
        adminRole: true,
        status: true,
      },
    })

    if (account?.accountType !== "admin") {
      throw new ForbiddenException("Admin access required.")
    }

    if (account.status === "suspended") {
      throw new ForbiddenException({
        error_code: "ACCOUNT_SUSPENDED",
        message: "This account has been suspended.",
      })
    }

    const role = toContractAdminRole(account.adminRole)
    if (!role) {
      throw new ForbiddenException({
        error_code: "ADMIN_ROLE_MISSING",
        message: "This admin account has no role assigned.",
      })
    }

    return {
      role,
      must_change_password: account.mustChangePassword,
      admin: {
        id: accountId,
        email: account.email,
        display_name: account.displayName,
      },
    }
  }
}
