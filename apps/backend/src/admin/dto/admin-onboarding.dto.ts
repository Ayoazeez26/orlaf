import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import type {
  AdminApplicationFilter,
  AdminInviteFilter,
} from "@sable/contracts"
import { Type } from "class-transformer"
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator"

const APPLICATION_FILTERS: AdminApplicationFilter[] = [
  "all",
  "pending",
  "approved",
  "rejected",
]

const INVITE_FILTERS: AdminInviteFilter[] = [
  "all",
  "sent",
  "accepted",
  "expired",
  "revoked",
]

class PaginatedQueryDto {
  @ApiPropertyOptional({ description: "Search by name or email" })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  q?: string

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number
}

export class ListApplicationsQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ enum: APPLICATION_FILTERS, default: "all" })
  @IsIn(APPLICATION_FILTERS, {
    message: `filter must be one of: ${APPLICATION_FILTERS.join(", ")}`,
  })
  @IsOptional()
  filter?: AdminApplicationFilter
}

export class ListInvitesQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ enum: INVITE_FILTERS, default: "all" })
  @IsIn(INVITE_FILTERS, {
    message: `filter must be one of: ${INVITE_FILTERS.join(", ")}`,
  })
  @IsOptional()
  filter?: AdminInviteFilter
}

export class RejectApplicationDto {
  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string
}

export class CreateCreatorInviteDto {
  @ApiProperty()
  @IsEmail()
  email!: string

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  firstName?: string

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastName?: string

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  note?: string
}
