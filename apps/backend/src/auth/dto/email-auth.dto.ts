import { ApiProperty } from "@nestjs/swagger"
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator"

export class EmailSignUpDto {
  @ApiProperty({ example: "Adekunle" })
  @IsString()
  firstName!: string

  @ApiProperty({ example: "Ciroma" })
  @IsString()
  lastName!: string

  @ApiProperty({ example: "you@example.com" })
  @IsEmail()
  email!: string

  @ApiProperty({ example: "min6chars", minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ enum: ["mobile", "creator-web"], required: false })
  @IsEnum(["mobile", "creator-web"])
  @IsOptional()
  surface?: "mobile" | "creator-web"

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invite_token?: string
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  verification_id!: string

  @ApiProperty({ example: "520177" })
  @IsString()
  @MinLength(6)
  code!: string

  @ApiProperty({ enum: ["mobile", "creator-web"], required: false })
  @IsEnum(["mobile", "creator-web"])
  @IsOptional()
  surface?: "mobile" | "creator-web"

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  device_label?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user_agent?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invite_token?: string
}

export class ResendVerificationDto {
  @ApiProperty()
  @IsString()
  verification_id!: string
}

export class EmailSignInDto {
  @ApiProperty({ example: "you@example.com" })
  @IsEmail()
  email!: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string

  @ApiProperty({ enum: ["mobile", "creator-web"] })
  @IsEnum(["mobile", "creator-web"])
  surface!: "mobile" | "creator-web"

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  device_label?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user_agent?: string
}
