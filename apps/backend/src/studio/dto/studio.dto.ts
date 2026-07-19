import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator"

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export enum SeriesTypeDto {
  SHORT_SERIES = "short_series",
  SHORT_FILM = "short_film",
}

export enum SeriesStatusDto {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  PUBLISHED = "published",
  REJECTED = "rejected",
  ARCHIVED = "archived",
}

export enum AccessTypeDto {
  FREE = "free",
  COIN_GATED = "coin_gated",
  PREMIUM = "premium",
}

// ---------------------------------------------------------------------------
// Cast / Crew
// ---------------------------------------------------------------------------

export class CastMemberDto {
  @ApiProperty({ example: "Adaeze Okafor" })
  @IsString()
  fullName!: string

  @ApiPropertyOptional({ example: "Ada" })
  @IsString()
  @IsOptional()
  stageName?: string
}

export class CrewMemberDto {
  @ApiProperty({ example: "Adeola Ciroma" })
  @IsString()
  fullName!: string

  @ApiProperty({ example: "Director" })
  @IsString()
  role!: string
}

// ---------------------------------------------------------------------------
// Series
// ---------------------------------------------------------------------------

export class CreateSeriesDto {
  @ApiProperty({ example: "Lagos After Dark" })
  @IsString()
  @MaxLength(200)
  title!: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  synopsis?: string

  @ApiProperty({ enum: SeriesTypeDto, default: SeriesTypeDto.SHORT_SERIES })
  @IsEnum(SeriesTypeDto)
  type!: SeriesTypeDto

  @ApiPropertyOptional({ type: [String], example: ["Drama", "Romance"] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[]

  @ApiPropertyOptional({ default: "English" })
  @IsString()
  @IsOptional()
  language?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subtitleLanguages?: string[]

  @ApiPropertyOptional({ type: [CastMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastMemberDto)
  @IsOptional()
  cast?: CastMemberDto[]

  @ApiPropertyOptional({ type: [CrewMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrewMemberDto)
  @IsOptional()
  crew?: CrewMemberDto[]

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  aiVerticalConversion?: boolean

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  autoCaptions?: boolean

  @ApiPropertyOptional({ description: "Film poster URL (9:16 vertical)" })
  @IsString()
  @IsOptional()
  posterUrl?: string

  @ApiPropertyOptional({ description: "Trailer URL (9:16 vertical)" })
  @IsString()
  @IsOptional()
  trailerUrl?: string

  @ApiPropertyOptional({ enum: AccessTypeDto, default: AccessTypeDto.FREE })
  @IsEnum(AccessTypeDto)
  @IsOptional()
  defaultAccessType?: AccessTypeDto

  @ApiPropertyOptional({ default: true, description: "Auto reframe to 9:16" })
  @IsBoolean()
  @IsOptional()
  autoReframeTo916?: boolean
}

export class UpdateSeriesDto {
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  title?: string

  @ApiProperty({ enum: SeriesTypeDto, default: SeriesTypeDto.SHORT_SERIES })
  @IsEnum(SeriesTypeDto)
  type!: SeriesTypeDto

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  synopsis?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[]

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  posterUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trailerUrl?: string

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subtitleLanguages?: string[]

  @ApiPropertyOptional({ type: [CastMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastMemberDto)
  @IsOptional()
  cast?: CastMemberDto[]

  @ApiPropertyOptional({ type: [CrewMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrewMemberDto)
  @IsOptional()
  crew?: CrewMemberDto[]

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  aiVerticalConversion?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoCaptions?: boolean

  @ApiPropertyOptional({ enum: AccessTypeDto })
  @IsEnum(AccessTypeDto)
  @IsOptional()
  defaultAccessType?: AccessTypeDto

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoReframeTo916?: boolean
}

export class UpdateSeriesSettingsDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  listedInSearch?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  commentsEnabled?: boolean

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  tippingEnabled?: boolean
}

// ---------------------------------------------------------------------------
// Episode
// ---------------------------------------------------------------------------

export class CreateEpisodeDto {
  @ApiProperty({ example: "The Awakening" })
  @IsString()
  @MaxLength(200)
  title!: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  synopsis?: string

  @ApiPropertyOptional({ enum: AccessTypeDto, default: AccessTypeDto.FREE })
  @IsEnum(AccessTypeDto)
  @IsOptional()
  accessType?: AccessTypeDto

  @ApiPropertyOptional({
    description: "Price in coins if access_type is coin_gated",
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  coinPrice?: number

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  aiVerticalConversion?: boolean

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  autoReframeTo916?: boolean

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  autoCaptionEnabled?: boolean

  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  season?: number

  @ApiPropertyOptional({ description: "Uploaded subtitle file URL (SRT/VTT)" })
  @IsString()
  @IsOptional()
  subtitleUrl?: string
}

export class UpdateEpisodeDto {
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  title?: string

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(2000)
  @IsOptional()
  synopsis?: string

  @ApiPropertyOptional({ enum: AccessTypeDto })
  @IsEnum(AccessTypeDto)
  @IsOptional()
  accessType?: AccessTypeDto

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @IsOptional()
  coinPrice?: number

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  aiVerticalConversion?: boolean
  @ApiPropertyOptional({ default: true })

  @IsBoolean()
  @IsOptional()
  autoReframeTo916?: boolean

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  autoCaptionEnabled?: boolean

  @ApiPropertyOptional({ default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  season?: number

  @ApiPropertyOptional({ description: "Uploaded subtitle file URL (SRT/VTT)" })
  @IsString()
  @IsOptional()
  subtitleUrl?: string
}

export class ReorderEpisodesDto {
  @ApiProperty({
    description: "Episode IDs in the desired order",
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  episodeIds!: string[]
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

export class CreateVideoUploadDto {
  @ApiProperty({ example: "The Awakening" })
  @IsString()
  title!: string

  @ApiProperty({ description: "Episode ID to associate the upload with" })
  @IsString()
  episodeId!: string
}
