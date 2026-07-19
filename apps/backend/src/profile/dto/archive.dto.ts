import { ApiPropertyOptional } from "@nestjs/swagger"
import type { ArchiveItemType } from "@sable/contracts"
import { IsEnum, IsOptional } from "class-validator"

export class ListArchiveQueryDto {
  @ApiPropertyOptional({
    enum: ["all", "project", "episode", "promotion"],
    default: "all",
  })
  @IsOptional()
  @IsEnum(["all", "project", "episode", "promotion"])
  type?: ArchiveItemType | "all"
}
