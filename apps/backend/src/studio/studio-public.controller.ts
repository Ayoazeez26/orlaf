import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiOperation, ApiTags } from "@nestjs/swagger"

import { PublicSeriesQueryDto } from "./dto/public-series-query.dto"
import { SeriesService } from "./series.service"

@ApiTags("Studio - Public")
@Controller("studio/public")
export class StudioPublicController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get("genres")
  @ApiOperation({ summary: "List available series genres with catalog counts" })
  async listPublicGenres() {
    return this.seriesService.findPublicGenres()
  }

  @Get("series")
  @ApiOperation({ summary: "List or search published series" })
  async listPublicSeries(@Query() query: PublicSeriesQueryDto) {
    const genres = [
      ...(query.genres ?? []),
      ...(query.genre ? [query.genre] : []),
    ]
    const uniqueGenres = genres.length > 0 ? [...new Set(genres)] : undefined

    return this.seriesService.findAllPublic({
      q: query.q,
      genres: uniqueGenres,
      type: query.type,
    })
  }

  @Get("series/:seriesId")
  @ApiOperation({ summary: "Get published series detail" })
  async getPublicSeries(@Param("seriesId") seriesId: string) {
    return this.seriesService.findOnePublic(seriesId)
  }

  @Get("series/:seriesId/episodes")
  @ApiOperation({ summary: "List episodes for a published series" })
  async getPublicEpisodes(@Param("seriesId") seriesId: string) {
    return this.seriesService.findPublicEpisodes(seriesId)
  }

  @Get("series/:seriesId/episodes/:episodeId")
  @ApiOperation({ summary: "Get episode detail for playback" })
  async getPublicEpisode(
    @Param("seriesId") seriesId: string,
    @Param("episodeId") episodeId: string
  ) {
    return this.seriesService.findOnePublicEpisode(seriesId, episodeId)
  }
}
