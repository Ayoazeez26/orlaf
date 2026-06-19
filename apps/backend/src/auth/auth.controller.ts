import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
import { type AccessTokenClaims } from "@sable/contracts"
import type { Request, Response } from "express"

import { AuthService } from "./auth.service"
import { SkipConsent } from "./consent.guard"
import { ConsentService } from "./consent.service"
import { DeletionService } from "./deletion.service"
import {
  AppleSignInDto,
  ConsentDto,
  LogoutDto,
  RefreshTokenDto,
  RevokeTokenDto,
} from "./dto/auth.dto"
import { GoogleSignInDto } from "./dto/sign-in.dto"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { RefreshTokenService } from "./refresh-token.service"
import {
  buildRefreshCookieOptions,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from "./auth-cookie.constants"
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
    private readonly consentService: ConsentService
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
    @Res({ passthrough: true }) res: Response
  ) {
    const { response, refreshToken } =
      await this.signInService.signInWithGoogle(body)

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
  // POST /auth/refresh
  // ---------------------------------------------------------------------------

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth("sable_rt")
  @ApiOperation({
    summary: "Refresh access token",
    description:
      "Mobile sends refresh_token in body. Web sends nothing — token is read from sable_rt httpOnly cookie.",
  })
  @ApiResponse({ status: 200, description: "New token pair issued" })
  @ApiResponse({ status: 401, description: "Invalid or expired refresh token" })
  async refresh(
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokenFromBody = body.refresh_token
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined
    const incomingToken = tokenFromBody ?? tokenFromCookie
    const isWeb = !tokenFromBody && !!tokenFromCookie

    if (!incomingToken) {
      throw new UnauthorizedException("No refresh token provided")
    }

    const { newRefreshToken, accountId } =
      await this.refreshTokenService.rotateRefreshToken(incomingToken)

    const accessToken = this.authService.issueAccessToken({
      account_id: accountId,
      account_type: body.account_type ?? ("user" as any),
      role: null,
    })

    this.logger.log({
      event: "token_pair_refreshed",
      account_id: accountId,
      is_web: isWeb,
    })

    if (isWeb) {
      res.cookie(
        REFRESH_COOKIE_NAME,
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
  @ApiBearerAuth()
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
    const { sub: accountId } = req.user
    const tokenFromBody = body.refresh_token
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined
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
      res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH })
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
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined
    const incomingToken = tokenFromBody ?? tokenFromCookie
    const isWeb = !tokenFromBody && !!tokenFromCookie

    if (!incomingToken) return

    await this.refreshTokenService.revokeByToken(incomingToken)

    if (isWeb) {
      res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH })
    }

    this.logger.log({ event: "refresh_token_logout", is_web: isWeb })
  }

  // ---------------------------------------------------------------------------
  // POST /auth/account/delete
  // ---------------------------------------------------------------------------

  @Post("account/delete")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
