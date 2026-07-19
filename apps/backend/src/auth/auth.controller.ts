import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"
import { type AccessTokenClaims, AccountType } from "@sable/contracts"
import type { Request, Response } from "express"

import { AdminAuthGuard } from "./admin-auth.guard"
import { AdminAuthService } from "./admin-auth.service"
import { toContractAdminRole } from "./admin-role.util"
import { AuthService } from "./auth.service"
import {
  buildRefreshCookieOptions,
  clearWebRefreshCookies,
  REFRESH_COOKIE_MAX_AGE_MS,
  REFRESH_COOKIE_NAME_ADMIN,
  readWebRefreshToken,
  refreshCookieNameForAccountType,
  webRefreshClientFromHint,
} from "./auth-cookie.constants"
import { SkipConsent } from "./consent.guard"
import { ConsentService } from "./consent.service"
import { DeletionService } from "./deletion.service"
import { AdminPasswordChangeDto, AdminSignInDto } from "./dto/admin-auth.dto"
import {
  AppleSignInDto,
  ConsentDto,
  LogoutDto,
  RefreshTokenDto,
  RevokeTokenDto,
} from "./dto/auth.dto"
import {
  EmailSignInDto,
  EmailSignUpDto,
  ResendVerificationDto,
  VerifyEmailDto,
} from "./dto/email-auth.dto"
import {
  ChangePasswordDto,
  SetPasswordDto,
  TotpCodeDto,
  VerifyMfaDto,
} from "./dto/security.dto"
import { GoogleSignInDto } from "./dto/sign-in.dto"
import { EmailAuthService } from "./email-auth.service"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { RefreshTokenService } from "./refresh-token.service"
import { SecurityService } from "./security.service"
import { parseSessionMetadata } from "./session-metadata.util"
import { SignInService } from "./sign-in.service"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authService: AuthService,
    private readonly deletionService: DeletionService,
    private readonly signInService: SignInService,
    private readonly consentService: ConsentService,
    private readonly emailAuthService: EmailAuthService,
    private readonly securityService: SecurityService,
    private readonly adminAuthService: AdminAuthService
  ) {}

  // ---------------------------------------------------------------------------
  // POST /auth/sign-in/google
  // ---------------------------------------------------------------------------

  @Post("sign-in/google")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Sign in with Google",
    description:
      "Verifies a Google ID token and returns access + refresh tokens. Mobile gets refresh token in body. creator-web gets it via httpOnly cookie.",
  })
  @ApiResponse({ status: 200, description: "Sign-in successful" })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired Google ID token",
  })
  @ApiResponse({
    status: 409,
    description: "Email already registered with a different provider",
  })
  async signInGoogle(
    @Body() body: GoogleSignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = parseSessionMetadata(req, {
      surface: body.surface,
      device_label: body.device_label,
      user_agent: body.user_agent,
    })

    const { response, refreshToken } =
      await this.signInService.signInWithGoogle({ ...body, session })

    if (response.requires_2fa) {
      return response
    }

    if (body.surface === "creator-web") {
      res.cookie(
        this.signInService.refreshCookieName,
        refreshToken,
        this.signInService.buildRefreshCookieOptions()
      )
      return response
    }

    return { ...response, refresh_token: refreshToken }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/sign-in/apple
  // ---------------------------------------------------------------------------

  @Post("sign-in/apple")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Sign in with Apple",
    description:
      "Verifies an Apple identity token. Apple only returns name on first sign-in — pass it when present.",
  })
  @ApiResponse({ status: 200, description: "Sign-in successful" })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired Apple identity token",
  })
  @ApiResponse({
    status: 409,
    description: "Email already registered with a different provider",
  })
  async signInApple(
    @Body() body: AppleSignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { response, refreshToken } =
      await this.signInService.signInWithApple(body)

    if (body.surface === "creator-web") {
      res.cookie(
        this.signInService.refreshCookieName,
        refreshToken,
        this.signInService.buildRefreshCookieOptions()
      )
      return response
    }

    return { ...response, refresh_token: refreshToken }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/sign-up/email
  // ---------------------------------------------------------------------------

  @Post("sign-up/email")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Sign up with email",
    description:
      "Creates an unverified creator account and sends a 6-digit OTP via email.",
  })
  @ApiResponse({ status: 201, description: "Verification email sent" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  async signUpEmail(@Body() body: EmailSignUpDto) {
    return this.emailAuthService.signUp(body)
  }

  // ---------------------------------------------------------------------------
  // POST /auth/verify-email
  // ---------------------------------------------------------------------------

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Verify email OTP",
    description:
      "Validates the 6-digit code and issues access + refresh tokens for creator-web.",
  })
  @ApiResponse({ status: 200, description: "Email verified and signed in" })
  @ApiResponse({ status: 401, description: "Invalid code" })
  @ApiResponse({ status: 410, description: "Code expired" })
  async verifyEmail(
    @Body() body: VerifyEmailDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = parseSessionMetadata(req, {
      surface: body.surface ?? "creator-web",
      device_label: body.device_label,
      user_agent: body.user_agent,
    })

    const { response, refreshToken } = await this.emailAuthService.verifyEmail({
      verification_id: body.verification_id,
      code: body.code,
      surface: body.surface ?? "creator-web",
      device_label: body.device_label,
      session,
      invite_token: body.invite_token,
    })

    if (response.requires_2fa) {
      return response
    }

    const surface = body.surface ?? "creator-web"
    if (surface === "creator-web") {
      res.cookie(
        this.signInService.refreshCookieName,
        refreshToken,
        this.signInService.buildRefreshCookieOptions()
      )
      return response
    }

    return { ...response, refresh_token: refreshToken }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/verify-email/resend
  // ---------------------------------------------------------------------------

  @Post("verify-email/resend")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Resend email verification OTP" })
  @ApiResponse({ status: 204, description: "Verification code resent" })
  @ApiResponse({ status: 429, description: "Resend cooldown active" })
  async resendVerification(@Body() body: ResendVerificationDto) {
    await this.emailAuthService.resendVerification(body.verification_id)
  }

  // ---------------------------------------------------------------------------
  // POST /auth/sign-in/email
  // ---------------------------------------------------------------------------

  @Post("sign-in/email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Sign in with email and password",
    description:
      "Creator email sign-in. Unverified accounts receive 403 with verification_id.",
  })
  @ApiResponse({ status: 200, description: "Sign-in successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @ApiResponse({ status: 403, description: "Email not verified" })
  async signInEmail(
    @Body() body: EmailSignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = parseSessionMetadata(req, {
      surface: body.surface,
      device_label: body.device_label,
      user_agent: body.user_agent,
    })

    const { response, refreshToken } = await this.emailAuthService.signIn({
      ...body,
      session,
    })

    if (response.requires_2fa) {
      return response
    }

    if (body.surface === "creator-web") {
      res.cookie(
        this.signInService.refreshCookieName,
        refreshToken,
        this.signInService.buildRefreshCookieOptions()
      )
      return response
    }

    return { ...response, refresh_token: refreshToken }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/sign-in/admin
  // ---------------------------------------------------------------------------

  @Post("sign-in/admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Admin sign in",
    description:
      "Email/password sign-in for admin accounts. Sets sable_rt_admin httpOnly cookie for admin-web.",
  })
  @ApiResponse({ status: 200, description: "Admin sign-in successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials or suspended" })
  @ApiResponse({ status: 403, description: "Inactive admin or missing role" })
  async signInAdmin(
    @Body() body: AdminSignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { response, refreshToken } = await this.adminAuthService.signIn(body)

    res.cookie(
      REFRESH_COOKIE_NAME_ADMIN,
      refreshToken,
      buildRefreshCookieOptions(REFRESH_COOKIE_MAX_AGE_MS)
    )

    return response
  }

  // ---------------------------------------------------------------------------
  // POST /auth/admin/password
  // ---------------------------------------------------------------------------

  @Post("admin/password")
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Change admin password",
    description:
      "Updates the signed-in admin password and clears must_change_password.",
  })
  @ApiResponse({ status: 204, description: "Password updated" })
  @ApiResponse({ status: 401, description: "Invalid current password" })
  async changeAdminPassword(
    @Body() body: AdminPasswordChangeDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    await this.adminAuthService.changePassword(req.user.sub, body)
  }

  // ---------------------------------------------------------------------------
  // GET /auth/admin/session
  // ---------------------------------------------------------------------------

  @Get("admin/session")
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Get current admin session metadata",
    description:
      "Returns admin profile and role for restoring session after refresh.",
  })
  @ApiResponse({ status: 200, description: "Admin session metadata" })
  async getAdminSession(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.adminAuthService.getSession(req.user.sub)
  }

  // ---------------------------------------------------------------------------
  // POST /auth/refresh
  // ---------------------------------------------------------------------------

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth("sable_rt_creator")
  @ApiOperation({
    summary: "Refresh access token",
    description:
      "Mobile sends refresh_token in body. Web sends nothing — token is read from sable_rt_creator (creator-web) or sable_rt_admin (admin-web) httpOnly cookies.",
  })
  @ApiResponse({ status: 200, description: "New token pair issued" })
  @ApiResponse({ status: 401, description: "Invalid or expired refresh token" })
  async refresh(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokenFromBody = body.refresh_token
    const webClient = webRefreshClientFromHint(body.account_type)
    const tokenFromCookie = readWebRefreshToken(req.cookies, webClient)
    const incomingToken = tokenFromBody ?? tokenFromCookie
    const isWeb = !tokenFromBody && !!tokenFromCookie

    if (!incomingToken) {
      throw new UnauthorizedException("No refresh token provided")
    }

    const { newRefreshToken, accountId, accountType, adminRole } =
      await this.refreshTokenService.rotateRefreshToken(incomingToken)

    if (body.account_type && body.account_type !== accountType) {
      throw new UnauthorizedException(
        "Refresh token does not match the requested account type."
      )
    }

    const resolvedAccountType = accountType as AccountType
    const role =
      resolvedAccountType === AccountType.ADMIN
        ? toContractAdminRole(adminRole)
        : null

    const accessToken = this.authService.issueAccessToken({
      account_id: accountId,
      account_type: resolvedAccountType,
      role,
    })

    this.logger.log({
      event: "token_pair_refreshed",
      account_id: accountId,
      is_web: isWeb,
    })

    if (isWeb) {
      res.cookie(
        refreshCookieNameForAccountType(accountType),
        newRefreshToken,
        buildRefreshCookieOptions(30 * 24 * 60 * 60 * 1000)
      )
      return { access_token: accessToken }
    }

    return { access_token: accessToken, refresh_token: newRefreshToken }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/logout
  // ---------------------------------------------------------------------------

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Logout",
    description:
      "Revokes the refresh token. Pass logout_all: true to revoke all sessions. Web clients send no body — cookie is used and cleared.",
  })
  @ApiResponse({ status: 204, description: "Logged out successfully" })
  @ApiResponse({ status: 401, description: "Invalid or missing access token" })
  async logout(
    @Body() body: LogoutDto,
    @Req() req: Request & { user: AccessTokenClaims },
    @Res({ passthrough: true }) res: Response
  ) {
    const { sub: accountId, account_type: accountType } = req.user
    const webClient =
      accountType === AccountType.ADMIN
        ? ("admin" as const)
        : ("creator" as const)
    const tokenFromBody = body.refresh_token
    const tokenFromCookie = readWebRefreshToken(req.cookies, webClient)
    const incomingToken = tokenFromBody ?? tokenFromCookie
    const isWeb = !tokenFromBody && !!tokenFromCookie
    const logoutAll = body.logout_all === true

    if (logoutAll) {
      const count =
        await this.refreshTokenService.revokeAllForAccount(accountId)
      this.logger.log({
        event: "logout_all",
        account_id: accountId,
        revoked_count: count,
      })
    } else if (incomingToken) {
      await this.refreshTokenService.revokeByToken(incomingToken)
      this.logger.log({ event: "logout", account_id: accountId, is_web: isWeb })
    } else {
      this.logger.warn({ event: "logout_no_token", account_id: accountId })
    }

    if (isWeb || logoutAll) {
      clearWebRefreshCookies(res, logoutAll ? undefined : webClient)
    }
  }

  // ---------------------------------------------------------------------------
  // POST /auth/refresh/revoke
  // ---------------------------------------------------------------------------

  @Post("refresh/revoke")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Revoke refresh token (deprecated)",
    description: "Kept for backwards compatibility. Prefer POST /auth/logout.",
  })
  @ApiResponse({ status: 204, description: "Token revoked" })
  async revoke(
    @Body() body: RevokeTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokenFromBody = body.refresh_token
    const tokenFromCookie =
      readWebRefreshToken(req.cookies, "creator") ??
      readWebRefreshToken(req.cookies, "admin")
    const incomingToken = tokenFromBody ?? tokenFromCookie
    const isWeb = !tokenFromBody && !!tokenFromCookie

    if (!incomingToken) return

    await this.refreshTokenService.revokeByToken(incomingToken)

    if (isWeb) {
      clearWebRefreshCookies(res)
    }

    this.logger.log({ event: "refresh_token_logout", is_web: isWeb })
  }

  // ---------------------------------------------------------------------------
  // POST /auth/account/delete
  // ---------------------------------------------------------------------------

  @Post("account/delete")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Delete account",
    description:
      "Initiates soft deletion for mobile user accounts. Sets status to pending_deletion, revokes all tokens, schedules anonymization after 30 days. Creator and admin tokens are rejected with 400.",
  })
  @ApiResponse({ status: 204, description: "Deletion initiated" })
  @ApiResponse({
    status: 400,
    description: "Not allowed for creator or admin accounts",
  })
  @ApiResponse({ status: 401, description: "Invalid or missing access token" })
  async deleteAccount(@Req() req: Request & { user: AccessTokenClaims }) {
    const { sub: accountId, account_type } = req.user
    await this.deletionService.initiateAccountDeletion(accountId, account_type)
  }

  // ---------------------------------------------------------------------------
  // GET /auth/session
  // ---------------------------------------------------------------------------

  @Get("session")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Get current session metadata",
    description:
      "Returns account state and profile fields for the authenticated user. Used by web clients to restore session after refresh.",
  })
  @ApiResponse({ status: 200, description: "Session metadata" })
  @ApiResponse({ status: 401, description: "Invalid or missing access token" })
  async getSession(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.signInService.getSessionMetadata(req.user.sub)
  }

  // ---------------------------------------------------------------------------
  // GET /auth/sessions — active devices (creators)
  // ---------------------------------------------------------------------------

  @Get("sessions")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "List active sessions for the current creator" })
  async listSessions(@Req() req: Request & { user: AccessTokenClaims }) {
    if (req.user.account_type !== AccountType.CREATOR) {
      throw new ForbiddenException("Creators only")
    }

    const refreshToken = readWebRefreshToken(req.cookies, "creator")
    const sessions = await this.refreshTokenService.listActiveSessions(
      req.user.sub,
      refreshToken
    )

    return { sessions }
  }

  // ---------------------------------------------------------------------------
  // DELETE /auth/sessions/:sessionId
  // ---------------------------------------------------------------------------

  @Delete("sessions/:sessionId")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Sign out a specific device session" })
  async revokeSession(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("sessionId") sessionId: string
  ) {
    if (req.user.account_type !== AccountType.CREATOR) {
      throw new ForbiddenException("Creators only")
    }

    await this.refreshTokenService.revokeSession(req.user.sub, sessionId)
  }

  // ---------------------------------------------------------------------------
  // GET /auth/security/status
  // ---------------------------------------------------------------------------

  @Get("security/status")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  async getSecurityStatus(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.securityService.getSecurityStatus(
      req.user.sub,
      req.user.account_type
    )
  }

  // ---------------------------------------------------------------------------
  // POST /auth/password/set
  // ---------------------------------------------------------------------------

  @Post("password/set")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @HttpCode(HttpStatus.NO_CONTENT)
  async setPassword(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: SetPasswordDto
  ) {
    await this.securityService.setPassword(
      req.user.sub,
      req.user.account_type,
      body.password
    )
  }

  // ---------------------------------------------------------------------------
  // POST /auth/password/change
  // ---------------------------------------------------------------------------

  @Post("password/change")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: ChangePasswordDto
  ) {
    await this.securityService.changePassword(
      req.user.sub,
      req.user.account_type,
      body.current_password,
      body.new_password
    )
  }

  // ---------------------------------------------------------------------------
  // POST /auth/2fa/totp/setup | enable | disable
  // ---------------------------------------------------------------------------

  @Post("2fa/totp/setup")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  async setupTotp(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.securityService.setupTotp(req.user.sub, req.user.account_type)
  }

  @Post("2fa/totp/enable")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @HttpCode(HttpStatus.NO_CONTENT)
  async enableTotp(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: TotpCodeDto
  ) {
    await this.securityService.enableTotp(
      req.user.sub,
      req.user.account_type,
      body.code
    )
  }

  @Post("2fa/totp/disable")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @ApiBearerAuth("access-token")
  @HttpCode(HttpStatus.NO_CONTENT)
  async disableTotp(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: TotpCodeDto
  ) {
    await this.securityService.disableTotp(
      req.user.sub,
      req.user.account_type,
      body.code
    )
  }

  // ---------------------------------------------------------------------------
  // POST /auth/2fa/verify — complete sign-in after primary auth
  // ---------------------------------------------------------------------------

  @Post("2fa/verify")
  @HttpCode(HttpStatus.OK)
  async verifyMfa(
    @Body() body: VerifyMfaDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const session = parseSessionMetadata(req)

    const { response, refreshToken } =
      await this.signInService.completeMfaSignIn({
        mfa_token: body.mfa_token,
        code: body.code,
        surface: "creator-web",
        session,
      })

    res.cookie(
      this.signInService.refreshCookieName,
      refreshToken,
      this.signInService.buildRefreshCookieOptions()
    )

    return response
  }

  // ---------------------------------------------------------------------------
  // GET /auth/policies
  // ---------------------------------------------------------------------------

  @Get("policies")
  @SkipConsent()
  @ApiOperation({
    summary: "Get current policy versions",
    description:
      "Public endpoint. Returns current version IDs for all policies.",
  })
  @ApiResponse({
    status: 200,
    description: "Current policy versions",
    schema: {
      type: "object",
      properties: {
        terms: { type: "string", example: "1.0.0" },
        privacy: { type: "string", example: "1.0.0" },
        community_guidelines: { type: "string", example: "1.0.0" },
        payment: { type: "string", example: "1.0.0" },
      },
    },
  })
  getPolicies() {
    return this.consentService.getCurrentPolicyVersions()
  }

  // ---------------------------------------------------------------------------
  // POST /auth/users/consent
  // ---------------------------------------------------------------------------

  @Post("users/consent")
  @UseGuards(JwtAuthGuard)
  @SkipConsent()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Record policy consent",
    description:
      "Records the user's acceptance of all current policies. Flips needs_consent to false. Required before accessing any feature endpoint.",
  })
  @ApiResponse({ status: 204, description: "Consent recorded" })
  @ApiResponse({ status: 400, description: "Missing policy version keys" })
  @ApiResponse({ status: 401, description: "Invalid or missing access token" })
  async recordConsent(
    @Body() body: ConsentDto,
    @Req() req: Request & { user: AccessTokenClaims }
  ) {
    const clientIp =
      (req as any).headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ??
      (req as any).socket?.remoteAddress

    const userAgent = (req as any).headers?.["user-agent"]

    await this.consentService.recordConsent({
      account_id: req.user.sub,
      policy_versions: {
        terms: body.policyVersions?.terms as any,
        privacy: body.policyVersions?.privacy as any,
        community_guidelines: body.policyVersions?.community_guidelines as any,
        payment: body.policyVersions?.payment as any,
      },
      client_ip: clientIp,
      user_agent: userAgent,
    })
  }
}
