import { ApiProperty } from "@nestjs/swagger"
import { IsIn, IsString } from "class-validator"

export class GetImageUploadUrlDto {
  @ApiProperty({
    example: "image/jpeg",
    enum: ["image/jpeg", "image/png", "image/webp"],
    description: "MIME type of the image file being uploaded",
  })
  @IsString()
  @IsIn(["image/jpeg", "image/png", "image/webp"])
  contentType!: string
}

export class GetVideoUploadUrlDto {
  @ApiProperty({
    example: "video/mp4",
    enum: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    description: "MIME type of the video file being uploaded",
  })
  @IsString()
  @IsIn(["video/mp4", "video/quicktime", "video/x-msvideo"])
  contentType!: string
}
