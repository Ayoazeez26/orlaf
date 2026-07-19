import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class AdminSignInDto {
  @ApiProperty({ example: "admin@sable.tv" })
  @IsEmail()
  email!: string

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password!: string
}

export class AdminPasswordChangeDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  currentPassword!: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword!: string
}
