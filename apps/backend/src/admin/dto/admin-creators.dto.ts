import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import type {
  AdminCreatorListFilter,
  AdminSuspendDuration,
} from "@sable/contracts"
import { ADMIN_SUSPEND_DURATIONS } from "@sable/contracts"
import { Type } from "class-transformer"
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator"

const LIST_FILTERS: AdminCreatorListFilter[] = [
  "all",
  "active",
  "suspended",
  "new",
]

export class ListCreatorsQueryDto {
  @ApiPropertyOptional({ enum: LIST_FILTERS, default: "all" })
  @IsIn(LIST_FILTERS, {
    message: `filter must be one of: ${LIST_FILTERS.join(", ")}`,
  })
  @IsOptional()
  filter?: AdminCreatorListFilter

  @ApiPropertyOptional({ description: "Search by name, handle, or email" })
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

export class SuspendCreatorDto {
  @ApiProperty({ enum: ADMIN_SUSPEND_DURATIONS })
  @IsIn(ADMIN_SUSPEND_DURATIONS, {
    message: `duration must be one of: ${ADMIN_SUSPEND_DURATIONS.join(", ")}`,
  })
  duration!: AdminSuspendDuration

  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  reason?: string
}

export class VerifyCreatorDto {
  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string
}
