import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { AccessTokenClaims } from "@sable/contracts"
import { AccountType } from "@sable/contracts"
import { ConsentService } from "./consent.service"

export const SKIP_CONSENT_KEY = "skipConsent"

/**
 * Marks a route as exempt from the consent gate.
 * Use on public routes and the consent endpoint itself.
 *
 * @example
 * \@SkipConsent()
 * \@Get('policies')
 * getPolicies() { ... }
 */
export const SkipConsent = () =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  (Reflect as any).metadata(SKIP_CONSENT_KEY, true)

/**
 * Blocks feature endpoints for user accounts that have not yet accepted policies.
 *
 * Apply after JwtAuthGuard so req.user is already populated.
 * Only USER accounts are gated — CREATOR and ADMIN accounts are not.
 *
 * @example
 * \@UseGuards(JwtAuthGuard, ConsentGuard)
 * \@Get('feed')
 * getFeed() { ... }
 */
@Injectable()
export class ConsentGuard implements CanActivate {
  private readonly logger = new Logger(ConsentGuard.name)

  constructor(
    private readonly consentService: ConsentService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is explicitly exempt
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CONSENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (skip) return true

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessTokenClaims }>()
    const user = req.user

    // No user — let JwtAuthGuard handle it
    if (!user) return true

    // Only gate USER accounts
    if (user.account_type !== AccountType.USER) return true

    const needsConsent = await this.consentService.accountNeedsConsent(user.sub)

    if (needsConsent) {
      this.logger.warn({
        event: "consent_gate_blocked",
        account_id: user.sub,
      })

      throw new ForbiddenException({
        error_code: "consent_required",
        message:
          "You must accept the current policies before accessing this feature.",
      })
    }

    return true
  }
}
