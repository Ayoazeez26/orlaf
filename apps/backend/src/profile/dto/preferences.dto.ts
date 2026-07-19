import { ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator"
import {
  COLOR_SCHEME_VALUES,
  DEFAULT_VISIBILITY_VALUES,
} from "../preferences.constants"

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ example: "English" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  defaultContentLanguage?: string

  @ApiPropertyOptional({ enum: DEFAULT_VISIBILITY_VALUES })
  @IsIn(DEFAULT_VISIBILITY_VALUES)
  @IsOptional()
  defaultVisibility?: (typeof DEFAULT_VISIBILITY_VALUES)[number]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  commentsEnabledByDefault?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoPublishAfterProcessing?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  tippingEnabledByDefault?: boolean

  @ApiPropertyOptional({ example: "English" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  dashboardLanguage?: string

  @ApiPropertyOptional({ example: "Africa/Lagos" })
  @IsString()
  @IsOptional()
  @MaxLength(80)
  timezone?: string

  @ApiPropertyOptional({ enum: COLOR_SCHEME_VALUES })
  @IsIn(COLOR_SCHEME_VALUES)
  @IsOptional()
  colorScheme?: (typeof COLOR_SCHEME_VALUES)[number]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  reducedMotion?: boolean
}
