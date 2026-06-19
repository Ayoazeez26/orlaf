import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator"

// ---------------------------------------------------------------------------
// Sign-in surface
// ---------------------------------------------------------------------------

export type SignInSurface = "mobile" | "creator-web"

// ---------------------------------------------------------------------------
// Google sign-in
// ---------------------------------------------------------------------------

export class GoogleSignInDto {
  @ApiProperty({ description: "Google ID token from native SDK" })
  @IsString()
  id_token!: string

  @ApiProperty({ enum: ["mobile", "creator-web"] })
  @IsEnum(["mobile", "creator-web"])
  surface!: SignInSurface

  @ApiPropertyOptional({ example: "Samsung Galaxy S24" })
  @IsString()
  @IsOptional()
  device_label?: string
}

// ---------------------------------------------------------------------------
// Apple sign-in
// ---------------------------------------------------------------------------

export class AppleNameDto {
  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  given_name!: string | null

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  family_name!: string | null
}

export class AppleSignInDto {
  @ApiProperty({
    description: "Apple identity token from AuthenticationServices",
  })
  @IsString()
  id_token!: string

  @ApiProperty({ enum: ["mobile", "creator-web"] })
  @IsEnum(["mobile", "creator-web"])
  surface!: SignInSurface

  @ApiPropertyOptional({ example: "iPhone 15 Pro" })
  @IsString()
  @IsOptional()
  device_label!: string

  @ApiPropertyOptional({
    description: "Full name — Apple only returns this on first sign-in",
    type: AppleNameDto,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => AppleNameDto)
  name!: AppleNameDto

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_private_email!: boolean
}

// ---------------------------------------------------------------------------
// Token refresh
// ---------------------------------------------------------------------------

export class RefreshTokenDto {
  @ApiPropertyOptional({
    description: "Mobile only — web uses httpOnly cookie",
  })
  @IsString()
  @IsOptional()
  refresh_token!: string

  @ApiPropertyOptional({ enum: ["user", "creator", "admin"] })
  @IsEnum(["user", "creator", "admin"])
  @IsOptional()
  account_type?: "user" | "creator" | "admin"
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export class LogoutDto {
  @ApiPropertyOptional({
    description: "Mobile only — web uses httpOnly cookie",
  })
  @IsString()
  @IsOptional()
  refresh_token!: string

  @ApiPropertyOptional({
    default: false,
    description: "Revoke all sessions across all devices",
  })
  @IsBoolean()
  @IsOptional()
  logout_all!: boolean
}

// ---------------------------------------------------------------------------
// Revoke (backwards compat)
// ---------------------------------------------------------------------------

export class RevokeTokenDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  refresh_token!: string
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export class PolicyVersionsDto {
  @ApiProperty({ example: "1.0.0" })
  @IsString()
  terms!: string

  @ApiProperty({ example: "1.0.0" })
  @IsString()
  privacy!: string

  @ApiProperty({ example: "1.0.0" })
  @IsString()
  community_guidelines!: string

  @ApiProperty({ example: "1.0.0" })
  @IsString()
  payment!: string
}

export class ConsentDto {
  @ApiProperty({
    enum: [true],
    description: "Must be true — backend rejects explicit false",
  })
  @IsBoolean()
  accepted!: true

  @ApiProperty({ type: PolicyVersionsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PolicyVersionsDto)
  policyVersions!: PolicyVersionsDto
}

// ---------------------------------------------------------------------------
// Email sign-in (future story)
// ---------------------------------------------------------------------------

export class EmailSignInDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email!: string

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string
}
