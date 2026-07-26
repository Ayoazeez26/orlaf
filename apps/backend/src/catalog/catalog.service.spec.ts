import { BadRequestException } from "@nestjs/common"
import { CatalogService } from "./catalog.service"

const mockPrisma = {
  series: { findMany: jest.fn() },
  playbackSession: { groupBy: jest.fn() },
  seriesLike: { groupBy: jest.fn() },
  shareEvent: { groupBy: jest.fn() },
  comment: { groupBy: jest.fn() },
}

function seriesCard(overrides: Record<string, unknown> = {}) {
  return {
    id: "s1",
    title: "Jollof Wars",
    synopsis: "A cook-off",
    type: "short_series",
    tags: [],
    posterUrl: "https://cdn/poster.jpg",
    publishedAt: new Date("2026-07-01T00:00:00.000Z"),
    createdAt: new Date("2026-06-01T00:00:00.000Z"),
    creator: {
      displayName: "@chef",
      creatorProfile: { studioName: "Lucid" },
    },
    _count: { episodes: 8 },
    seriesGenres: [{ genre: { name: "Drama", sortOrder: 1 } }],
    ...overrides,
  }
}

describe("CatalogService", () => {
  let service: CatalogService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new CatalogService(mockPrisma as never)
    mockPrisma.playbackSession.groupBy.mockResolvedValue([])
    mockPrisma.seriesLike.groupBy.mockResolvedValue([])
    mockPrisma.shareEvent.groupBy.mockResolvedValue([])
    mockPrisma.comment.groupBy.mockResolvedValue([])
  })

  it("returns ranked playable feed items", async () => {
    mockPrisma.series.findMany.mockResolvedValue([
      {
        id: "s1",
        title: "Jollof Wars",
        publishedAt: new Date(),
        createdAt: new Date(),
        creator: {
          displayName: "@chef",
          creatorProfile: { studioName: "Lucid" },
        },
        episodes: [
          {
            id: "e1",
            title: "Pilot",
            synopsis: "Start",
            thumbnailUrl: null,
            hlsUrl: "https://example.com/a.m3u8",
            durationSeconds: 120,
            accessType: "free",
          },
        ],
      },
      {
        id: "s2",
        title: "No HLS",
        publishedAt: new Date(),
        createdAt: new Date(),
        creator: { displayName: null, creatorProfile: null },
        episodes: [],
      },
    ])

    mockPrisma.seriesLike.groupBy.mockResolvedValue([
      { seriesId: "s1", _count: { _all: 10 } },
    ])

    const feed = await service.getFeed()

    expect(feed).toHaveLength(1)
    expect(feed[0]).toMatchObject({
      id: "e1",
      seriesId: "s1",
      seriesTitle: "Jollof Wars",
      creatorName: "Lucid",
      hlsUrl: "https://example.com/a.m3u8",
    })
    expect(feed[0]).not.toHaveProperty("_score")
  })

  it("returns empty when nothing is playable", async () => {
    mockPrisma.series.findMany.mockResolvedValue([])
    await expect(service.getFeed()).resolves.toEqual([])
  })

  it("rejects unknown collection keys", async () => {
    await expect(service.getCollection("mystery")).rejects.toBeInstanceOf(
      BadRequestException
    )
  })

  it("lists new collection by publishedAt", async () => {
    mockPrisma.series.findMany.mockResolvedValue([seriesCard()])

    const result = await service.getCollection("new")

    expect(result.key).toBe("new")
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      id: "s1",
      title: "Jollof Wars",
      genres: ["Drama"],
      episodeCount: 8,
      creatorName: "Lucid",
      viewCount: null,
    })
    expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { publishedAt: "desc" },
      })
    )
  })

  it("filters editorial collections by tags", async () => {
    mockPrisma.series.findMany.mockResolvedValue([
      seriesCard({ tags: ["ai-films", "sci-fi"] }),
    ])

    const result = await service.getCollection("ai-films")

    expect(result.items[0]?.tags).toContain("ai-films")
    expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { hasSome: ["ai-films", "ai"] },
        }),
      })
    )
  })

  it("ranks popular by engagement without requiring playable HLS", async () => {
    mockPrisma.series.findMany.mockResolvedValue([
      seriesCard({ id: "low", title: "Quiet" }),
      seriesCard({ id: "hot", title: "Hot" }),
    ])
    mockPrisma.playbackSession.groupBy.mockResolvedValue([
      { seriesId: "hot", _count: { _all: 50 } },
      { seriesId: "low", _count: { _all: 2 } },
    ])

    const result = await service.getCollection("popular")

    expect(result.items.map((item) => item.id)).toEqual(["hot", "low"])
    expect(result.items[0]?.viewCount).toBe(50)
  })
})
