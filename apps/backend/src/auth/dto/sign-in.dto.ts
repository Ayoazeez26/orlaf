import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"

export class GoogleSignInDto {
  @ApiProperty({ description: "Google ID token from native SDK" })
  @IsString()
  id_token!: string

  @ApiProperty({ enum: ["mobile", "creator-web"] })
  @IsEnum(["mobile", "creator-web"])
  surface!: "mobile" | "creator-web"

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  device_label!: string
}
