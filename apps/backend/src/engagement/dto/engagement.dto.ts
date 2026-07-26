import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator"

const SHARE_CHANNELS = [
  "whatsapp",
  "telegram",
  "x",
  "facebook",
  "stories",
  "email",
  "qr",
  "more",
  "copy",
  "native",
] as const

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body!: string

  @IsOptional()
  @IsString()
  parent_id?: string | null
}

export class RecordShareDto {
  @IsString()
  @IsIn(SHARE_CHANNELS)
  channel!: (typeof SHARE_CHANNELS)[number]
}

export class ListCommentsQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string

  @IsOptional()
  @IsString()
  parent_id?: string
}
