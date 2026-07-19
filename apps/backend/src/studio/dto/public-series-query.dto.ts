import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator"

import { SeriesTypeDto } from "./studio.dto"

export function normalizeGenreQuery(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === "") return undefined

  const raw = Array.isArray(value) ? value : [value]
  const genres = raw
    .flatMap((entry) => String(entry).split(","))
    .map((genre) => genre.trim())
    .filter(Boolean)

  return genres.length > 0 ? genres : undefined
}

export class PublicSeriesQueryDto {
  @ApiPropertyOptional({
    description: "Search published series by title or synopsis",
    example: "lagos",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string

  @ApiPropertyOptional({
    description: "Filter by a single genre (alias for genres)",
    example: "Drama",
  })
  @IsOptional()
  @IsString()
  genre?: string

  @ApiPropertyOptional({
    description:
      "Filter by genres — comma-separated or repeated. Matches series with any of the given genres.",
    example: ["Drama", "Romance"],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeGenreQuery(value))
  @IsArray()
  @IsString({ each: true })
  genres?: string[]

  @ApiPropertyOptional({
    enum: SeriesTypeDto,
    description: "Filter by series type",
  })
  @IsOptional()
  @IsEnum(SeriesTypeDto)
  type?: SeriesTypeDto
}
