import { Controller, Get, Param, Query } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger"
import { CatalogService } from "./catalog.service"
import { CatalogCollectionQueryDto } from "./dto/catalog-collection.dto"

const COLLECTION_KEY_ENUM = [
  "featured",
  "trending",
  "new",
  "popular",
  "old-nollywood",
  "ai-films",
  "sable-originals",
] as const

@ApiTags("Catalog")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("feed")
  @ApiOperation({
    summary: "For You feed — ranked playable episodes across public series",
  })
  async getFeed() {
    return this.catalogService.getFeed()
  }

  @Get("collections/:key")
  @ApiOperation({
    summary:
      "Home tab collection — featured/trending/new/popular or tagged editorial sets",
  })
  @ApiParam({
    name: "key",
    enum: COLLECTION_KEY_ENUM,
  })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getCollection(
    @Param("key") key: string,
    @Query() query: CatalogCollectionQueryDto
  ) {
    return this.catalogService.getCollection(key, query.limit ?? 40)
  }
}
