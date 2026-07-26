import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import type { AccessTokenClaims } from "@sable/contracts"
import type { Request } from "express"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { CreateDownloadsDto } from "./dto/create-downloads.dto"
import { LibraryService } from "./library.service"

@ApiTags("Library")
@ApiBearerAuth("access-token")
@UseGuards(JwtAuthGuard)
@Controller("library")
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get("watchlist")
  @ApiOperation({ summary: "List saved series in the user's watchlist" })
  async listWatchlist(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.libraryService.listWatchlist(req.user.sub)
  }

  @Delete("watchlist")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove all series from the watchlist" })
  async clearWatchlist(@Req() req: Request & { user: AccessTokenClaims }) {
    await this.libraryService.clearWatchlist(req.user.sub)
  }

  @Post("watchlist/:seriesId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Save a series to the watchlist" })
  async addToWatchlist(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    await this.libraryService.addToWatchlist(req.user.sub, seriesId)
  }

  @Delete("watchlist/:seriesId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove a series from the watchlist" })
  async removeFromWatchlist(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    await this.libraryService.removeFromWatchlist(req.user.sub, seriesId)
  }

  @Get("watchlist/:seriesId/status")
  @ApiOperation({ summary: "Check whether a series is saved to the watchlist" })
  async getWatchlistStatus(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("seriesId") seriesId: string
  ) {
    return this.libraryService.getWatchlistStatus(req.user.sub, seriesId)
  }

  // ---------------------------------------------------------------------------
  // Downloads
  // ---------------------------------------------------------------------------

  @Get("downloads")
  @ApiOperation({ summary: "List the user's tracked downloads" })
  async listDownloads(@Req() req: Request & { user: AccessTokenClaims }) {
    return this.libraryService.listDownloads(req.user.sub)
  }

  @Post("downloads")
  @ApiOperation({
    summary:
      "Queue downloads for the current/next/all episodes (quality preference stored)",
  })
  async createDownloads(
    @Req() req: Request & { user: AccessTokenClaims },
    @Body() body: CreateDownloadsDto
  ) {
    return this.libraryService.createDownloads(req.user.sub, body)
  }

  @Delete("downloads")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Clear all downloads for the user" })
  async clearDownloads(@Req() req: Request & { user: AccessTokenClaims }) {
    await this.libraryService.clearDownloads(req.user.sub)
  }

  @Delete("downloads/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove a single download entry" })
  async removeDownload(
    @Req() req: Request & { user: AccessTokenClaims },
    @Param("id") id: string
  ) {
    await this.libraryService.removeDownload(req.user.sub, id)
  }
}
