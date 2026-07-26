import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator"

const DEVICE_TYPES = ["mobile", "desktop", "tablet", "tv"] as const
const PLATFORMS = ["ios", "android", "web"] as const
const SOURCES = ["for_you", "series", "search", "share", "external"] as const

export class StartPlaybackSessionDto {
  @IsString()
  @MinLength(1)
  episode_id!: string

  @IsOptional()
  @IsString()
  anon_id?: string | null

  @IsString()
  @IsIn(DEVICE_TYPES)
  device_type!: (typeof DEVICE_TYPES)[number]

  @IsOptional()
  @IsString()
  @IsIn(PLATFORMS)
  platform?: (typeof PLATFORMS)[number] | null

  @IsOptional()
  @IsString()
  @IsIn(SOURCES)
  source?: (typeof SOURCES)[number] | null

  @IsOptional()
  @IsString()
  app_version?: string | null
}

export class PlaybackHeartbeatDto {
  @IsInt()
  @Min(0)
  watched_seconds!: number

  @IsInt()
  @Min(0)
  max_position_seconds!: number

  @IsOptional()
  @IsBoolean()
  completed?: boolean

  @IsOptional()
  @IsBoolean()
  ended?: boolean
}
