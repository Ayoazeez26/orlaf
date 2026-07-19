import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CustomLogger } from "@sable/logger"
import { Resend } from "resend"

@Injectable()
export class EmailService {
  private readonly logger = new CustomLogger(EmailService.name)
  private readonly resend: Resend
  private readonly fromEmail: string

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(this.config.getOrThrow<string>("RESEND_API_KEY"))
    this.fromEmail = this.config.getOrThrow<string>("RESEND_FROM_EMAIL")
  }

  async sendVerificationCode(input: {
    to: string
    code: string
    expiresInMinutes: number
    verifyUrl: string
  }): Promise<void> {
    const { to, code, expiresInMinutes, verifyUrl } = input

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: "Verify your Sable account",
      html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e8e8e8;">
                  
                  <!-- Logo / Brand -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 700; color: #0f0f0f;">Sable TV</p>
                    </td>
                  </tr>

                  <!-- Heading -->
                  <tr>
                    <td style="padding-bottom: 8px;">
                      <p style="margin: 0; font-size: 22px; font-weight: 600; color: #0f0f0f;">Verify your email</p>
                    </td>
                  </tr>

                  <!-- Subtext -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                        Use the code below or click the button to verify your email address. This code expires in <strong>${expiresInMinutes} minutes</strong>.
                      </p>
                    </td>
                  </tr>

                  <!-- OTP Code -->
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <div style="background: #f4f4f5; border-radius: 8px; padding: 20px; text-align: center;">
                        <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Verification code</p>
                        <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #0f0f0f;">${code}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding-bottom: 32px; text-align: center;">
                      <a href="${verifyUrl}"
                        style="display: inline-block; background-color: #0f0f0f; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
                        Verify my email
                      </a>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding-bottom: 24px; border-top: 1px solid #e8e8e8;"></td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                        If you didn't create a Sable account, you can safely ignore this email.<br/>
                        For security, never share this code with anyone.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    })

    if (error) {
      this.logger.error({ event: "verification_email_failed", to }, error)
      throw error
    }

    this.logger.log({ event: "verification_email_sent", to })
  }

  async sendCreatorInvite(input: {
    to: string
    firstName?: string | null
    note?: string | null
    acceptUrl: string
  }): Promise<void> {
    const { to, firstName, note, acceptUrl } = input
    const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : "Hi,"
    const message =
      note?.trim() ||
      "We loved your work and would love to have you on Sable TV."

    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject: "You're invited to create on Sable TV",
      html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e8e8e8;">

                  <tr>
                    <td style="padding-bottom: 32px;">
                      <p style="margin: 0; font-size: 20px; font-weight: 700; color: #0f0f0f;">Sable TV</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 8px;">
                      <p style="margin: 0; font-size: 22px; font-weight: 600; color: #0f0f0f;">You're invited to create on Sable TV</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 24px;">
                      <p style="margin: 0; font-size: 15px; color: #6b7280; line-height: 1.6;">
                        ${greeting}<br/><br/>${message}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 32px; text-align: center;">
                      <a href="${acceptUrl}"
                        style="display: inline-block; background-color: #0f0f0f; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
                        Accept invite
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 24px; border-top: 1px solid #e8e8e8;"></td>
                  </tr>

                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                        If you weren't expecting this invite, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    })

    if (error) {
      this.logger.error({ event: "creator_invite_email_failed", to }, error)
      throw error
    }

    this.logger.log({ event: "creator_invite_email_sent", to })
  }
}
