import { IsIn, IsOptional, IsString } from "class-validator"

export class CreateDownloadsDto {
  @IsString()
  seriesId!: string

  @IsOptional()
  @IsString()
  currentEpisodeId?: string

  @IsIn(["current", "next", "select", "all"])
  target!: "current" | "next" | "select" | "all"

  @IsIn(["standard", "high", "full_hd"])
  quality!: "standard" | "high" | "full_hd"
}
