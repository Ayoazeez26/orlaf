import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class SetPasswordDto {
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  current_password!: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  new_password!: string
}

export class TotpCodeDto {
  @ApiProperty({ example: "123456" })
  @IsString()
  @MinLength(6)
  code!: string
}

export class VerifyMfaDto {
  @ApiProperty()
  @IsString()
  mfa_token!: string

  @ApiProperty({ example: "123456" })
  @IsString()
  @MinLength(6)
  code!: string
}

export class SessionClientMetadataDto {
  @ApiPropertyOptional()
  @IsString()
  user_agent?: string
}
