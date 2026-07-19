import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"

const CREATOR_TYPES = ["solo", "studio"] as const
const TEAM_SIZES = ["1-5", "6-15", "16-50", "50+"] as const
const CONTENT_FORMATS = [
  "short-drama",
  "web-series",
  "micro-content",
  "documentary",
  "ai-films",
] as const
const GET_STARTED_MODES = ["upload", "create-series"] as const
const ONBOARDING_STEPS = [
  "creator-type",
  "studio",
  "content",
  "get-started",
] as const

function oneOfMessage(field: string, values: readonly string[]): string {
  return `${field} must be one of: ${values.join(", ")}`
}

export class OnboardingStudioDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    enum: TEAM_SIZES,
    example: "1-5",
    required: false,
    nullable: true,
  })
  @IsIn([...TEAM_SIZES], {
    message: oneOfMessage("team_size", TEAM_SIZES),
  })
  @IsOptional()
  team_size?: (typeof TEAM_SIZES)[number] | null

  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @IsOptional()
  website?: string | null
}

export class PatchOnboardingDto {
  @ApiProperty({ enum: ONBOARDING_STEPS, required: false })
  @IsIn([...ONBOARDING_STEPS], {
    message: oneOfMessage("step", ONBOARDING_STEPS),
  })
  @IsOptional()
  step?: (typeof ONBOARDING_STEPS)[number]

  @ApiProperty({ enum: CREATOR_TYPES, required: false, nullable: true })
  @IsIn([...CREATOR_TYPES], {
    message: oneOfMessage("creator_type", CREATOR_TYPES),
  })
  @IsOptional()
  creator_type?: (typeof CREATOR_TYPES)[number] | null

  @ApiProperty({ type: OnboardingStudioDto, required: false, nullable: true })
  @ValidateNested()
  @Type(() => OnboardingStudioDto)
  @IsOptional()
  studio?: OnboardingStudioDto | null

  @ApiProperty({ enum: CONTENT_FORMATS, isArray: true, required: false })
  @IsArray()
  @IsIn([...CONTENT_FORMATS], {
    each: true,
    message: oneOfMessage("content_formats", CONTENT_FORMATS),
  })
  @IsOptional()
  content_formats?: (typeof CONTENT_FORMATS)[number][]

  @ApiProperty({ enum: GET_STARTED_MODES, required: false, nullable: true })
  @IsIn([...GET_STARTED_MODES], {
    message: oneOfMessage("get_started_mode", GET_STARTED_MODES),
  })
  @IsOptional()
  get_started_mode?: (typeof GET_STARTED_MODES)[number] | null
}
