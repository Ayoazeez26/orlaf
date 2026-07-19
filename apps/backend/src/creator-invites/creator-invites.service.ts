import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { ValidateCreatorInviteResponse } from "@sable/contracts"
import { CustomLogger } from "@sable/logger"
import { CreatorInvite } from "src/generated/prisma/client"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class CreatorInvitesService {
  private readonly logger = new CustomLogger(CreatorInvitesService.name)

  constructor(private readonly prisma: PrismaService) {}

  async validateByToken(token: string): Promise<ValidateCreatorInviteResponse> {
    const invite = await this.prisma.creatorInvite.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new NotFoundException("Invite not found.")
    }

    return this.toValidationResponse(invite)
  }

  async assertValidForSignup(token: string, email: string): Promise<void> {
    const invite = await this.findInviteOrThrow(token)
    const validation = this.toValidationResponse(invite)

    if (!validation.valid) {
      throw new BadRequestException(
        validation.message ?? "This invite is no longer valid."
      )
    }

    const emailNormalized = this.normalizeEmail(email)
    if (invite.emailNormalized !== emailNormalized) {
      throw new BadRequestException(
        "Sign-up email must match the invited email address."
      )
    }
  }

  async acceptByToken(token: string, email: string): Promise<void> {
    const invite = await this.findInviteOrThrow(token)
    const validation = this.toValidationResponse(invite)

    if (!validation.valid) {
      throw new BadRequestException(
        validation.message ?? "This invite is no longer valid."
      )
    }

    const emailNormalized = this.normalizeEmail(email)
    if (invite.emailNormalized !== emailNormalized) {
      throw new BadRequestException(
        "Sign-up email must match the invited email address."
      )
    }

    const now = new Date()
    await this.prisma.creatorInvite.update({
      where: { id: invite.id },
      data: {
        status: "accepted",
        acceptedAt: now,
      },
    })

    this.logger.log({
      event: "creator_invite_accepted",
      invite_id: invite.id,
      email: invite.email,
    })
  }

  async hasAcceptedInvite(emailNormalized: string): Promise<boolean> {
    const invite = await this.prisma.creatorInvite.findFirst({
      where: {
        emailNormalized,
        status: "accepted",
      },
      select: { id: true },
    })

    return invite !== null
  }

  private async findInviteOrThrow(token: string): Promise<CreatorInvite> {
    const invite = await this.prisma.creatorInvite.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new NotFoundException("Invite not found.")
    }

    return invite
  }

  private toValidationResponse(
    invite: CreatorInvite
  ): ValidateCreatorInviteResponse {
    if (invite.status === "revoked") {
      return {
        valid: false,
        status: "revoked",
        message: "This invite has been revoked.",
      }
    }

    if (invite.status === "accepted") {
      return {
        valid: false,
        status: "accepted",
        message: "This invite has already been accepted. Log in to continue.",
      }
    }

    if (invite.status === "expired" || invite.expiresAt <= new Date()) {
      return {
        valid: false,
        status: "expired",
        message: "This invite has expired. Ask your admin to send a new one.",
      }
    }

    return {
      valid: true,
      status: "sent",
      email: invite.email,
      firstName: invite.firstName,
      lastName: invite.lastName,
      note: invite.note,
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase().normalize("NFC")
  }
}
