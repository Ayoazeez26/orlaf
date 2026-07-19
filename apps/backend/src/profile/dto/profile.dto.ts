import { ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateIf,
} from "class-validator"

// ---------------------------------------------------------------------------
// Personal profile
// ---------------------------------------------------------------------------

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Adaeze" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string

  @ApiPropertyOptional({ example: "Okonkwo" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string

  @ApiPropertyOptional({ example: "@adaeze_creates" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  displayName?: string

  @ApiPropertyOptional({ example: "Filmmaker & storyteller." })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string

  @ApiPropertyOptional({ example: "+2348012345678" })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({
    example: "https://media.sable.tv/avatars/abc.jpg",
    nullable: true,
    description: "Pass null to remove the profile photo.",
  })
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsOptional()
  avatarUrl?: string | null
}

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------

export class UpdateSocialLinksDto {
  @ApiPropertyOptional({ example: "https://instagram.com/adaeze_creates" })
  @IsUrl()
  @IsOptional()
  instagramUrl?: string

  @ApiPropertyOptional({ example: "https://twitter.com/adaeze_creates" })
  @IsUrl()
  @IsOptional()
  twitterUrl?: string

  @ApiPropertyOptional({ example: "https://youtube.com/@adaeze_creates" })
  @IsUrl()
  @IsOptional()
  youtubeUrl?: string

  @ApiPropertyOptional({ example: "https://tiktok.com/@adaeze_creates" })
  @IsUrl()
  @IsOptional()
  tiktokUrl?: string
}

// ---------------------------------------------------------------------------
// Studio profile
// ---------------------------------------------------------------------------

export class UpdateStudioDto {
  @ApiPropertyOptional({ example: "Lucid Productions" })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  studioName?: string

  @ApiPropertyOptional({ example: "lucid-productions" })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: "Handle can only contain lowercase letters, numbers and hyphens",
  })
  handle?: string

  @ApiPropertyOptional({ example: "Creating premium African drama series." })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({ example: "https://media.sable.tv/logos/abc.jpg" })
  @IsString()
  @IsOptional()
  logoUrl?: string
}

// ---------------------------------------------------------------------------
// Avatar / logo upload
// ---------------------------------------------------------------------------

export class GetAvatarUploadUrlDto {
  @ApiPropertyOptional({
    example: "image/jpeg",
    enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  })
  @IsString()
  @IsOptional()
  contentType?: string
}
