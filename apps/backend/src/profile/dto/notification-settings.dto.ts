import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsOptional } from "class-validator"

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  episodePublishedEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  newCommentsEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  contentFlaggedEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  payoutProcessedEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  coinPurchasesEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  revenueMilestoneEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  subscriberMilestoneEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  weeklyDigestEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  seriesTrendingEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  teamMemberJoinedEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  permissionChangedEnabled?: boolean
}
