import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsObject, IsOptional, IsString } from "class-validator"

export class CloudflareWebhookStatusDto {
  @ApiProperty({ example: "ready" })
  @IsString()
  state!: string // 'ready' | 'error' | 'inprogress' | 'queued'

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pctComplete?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  errReasonCode?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  errReasonText?: string
}

export class CloudflareWebhookDto {
  @ApiProperty()
  @IsString()
  uid!: string

  @ApiProperty()
  @IsString()
  status!: any

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  playback?: {
    hls?: string
    dash?: string
  }

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  input?: {
    width?: number
    height?: number
  }

  @ApiPropertyOptional()
  duration?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnail?: string

  @ApiPropertyOptional()
  @IsOptional()
  readyToStream?: boolean
}
