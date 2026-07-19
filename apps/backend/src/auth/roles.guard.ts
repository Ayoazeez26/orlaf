import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import type { AccessTokenClaims } from "@sable/contracts"
import { AdminRole } from "@sable/contracts"
import { ROLES_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles?.length) {
      return true
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessTokenClaims }>()
    const user = req.user

    if (!user?.role) {
      throw new ForbiddenException("Admin role required.")
    }

    if (user.role === AdminRole.SUPER_ADMIN) {
      return true
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Insufficient admin permissions.")
    }

    return true
  }
}
