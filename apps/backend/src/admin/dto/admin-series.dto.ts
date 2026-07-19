import { ApiPropertyOptional } from "@nestjs/swagger"
import type { AdminSeriesListFilter } from "@sable/contracts"
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

const LIST_FILTERS: AdminSeriesListFilter[] = [
  "all",
  "pending-review",
  "rejected",
]

export class ListSeriesQueryDto {
  @ApiPropertyOptional({ enum: LIST_FILTERS, default: "all" })
  @IsIn(LIST_FILTERS, {
    message: `filter must be one of: ${LIST_FILTERS.join(", ")}`,
  })
  @IsOptional()
  filter?: AdminSeriesListFilter

  @ApiPropertyOptional({ description: "Search by title or creator" })
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

export class AdminSeriesActionDto {
  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  note?: string
}
