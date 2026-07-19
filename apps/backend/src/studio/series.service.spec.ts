import { ForbiddenException, NotFoundException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { SeriesTypeDto } from "./dto/studio.dto"
import { SeriesService } from "./series.service"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSeries = {
  id: "series_1",
  creatorId: "creator_1",
  title: "Lagos After Dark",
  synopsis: "A gripping tale",
  type: "short_series",
  status: "draft",
  seriesGenres: [{ genre: { name: "Drama", sortOrder: 1 } }],
  language: "English",
  tags: [],
  posterUrl: null,
  trailerUrl: null,
  isPublic: true,
  listedInSearch: true,
  commentsEnabled: true,
  tippingEnabled: false,
  cast: [],
  crew: [],
  aiVerticalConversion: true,
  autoCaptions: true,
  subtitleLanguages: [],
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  episodes: [],
  _count: { episodes: 0 },
}

const mockPrisma = {
  series: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  episode: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  creatorProfile: {
    findUnique: jest.fn(),
  },
  genre: {
    findMany: jest.fn(),
  },
  seriesGenre: {
    groupBy: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

const mockVideoHosting = {
  createImageUploadUrl: jest.fn(),
  createVideo: jest.fn(),
  getVideoMetadata: jest.fn(),
  deleteVideo: jest.fn(),
  getSignedPlaybackUrl: jest.fn(),
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SeriesService", () => {
  let service: SeriesService

  beforeEach(async () => {
    jest.clearAllMocks()
    mockPrisma.creatorProfile.findUnique.mockResolvedValue(null)
    const module = await Test.createTestingModule({
      providers: [
        SeriesService,
        { provide: "PrismaService", useValue: mockPrisma },
      ],
    }).compile()

    const prisma = module.get("PrismaService")
    service = new SeriesService(prisma as any, mockVideoHosting as any)
  })

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------

  describe("create()", () => {
    it("creates a series with defaults", async () => {
      mockPrisma.genre.findMany.mockResolvedValue([])
      mockPrisma.series.create.mockResolvedValue(mockSeries)

      const result = await service.create("creator_1", {
        title: "Lagos After Dark",
        type: SeriesTypeDto.SHORT_SERIES,
      })

      expect(result.genres).toEqual(["Drama"])
      expect(result.title).toBe("Lagos After Dark")
      expect(mockPrisma.series.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            creatorId: "creator_1",
            title: "Lagos After Dark",
            status: undefined,
          }),
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------

  describe("findAll()", () => {
    it("returns series for the creator", async () => {
      mockPrisma.series.findMany.mockResolvedValue([mockSeries])

      const result = await service.findAll("creator_1")

      expect(result).toHaveLength(1)
      expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { creatorId: "creator_1" },
        })
      )
    })

    it("filters by status", async () => {
      mockPrisma.series.findMany.mockResolvedValue([])

      await service.findAll("creator_1", { status: "published" as any })

      expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { creatorId: "creator_1", status: "published" },
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // findOne
  // -------------------------------------------------------------------------

  describe("findOne()", () => {
    it("returns series when creator owns it", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(mockSeries)

      const result = await service.findOne("creator_1", "series_1")
      expect(result.id).toBe("series_1")
    })

    it("throws NotFoundException when not found", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(null)

      await expect(service.findOne("creator_1", "series_x")).rejects.toThrow(
        NotFoundException
      )
    })

    it("throws ForbiddenException when different creator", async () => {
      mockPrisma.series.findUnique.mockResolvedValue({
        ...mockSeries,
        creatorId: "other_creator",
      })

      await expect(service.findOne("creator_1", "series_1")).rejects.toThrow(
        ForbiddenException
      )
    })
  })

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------

  describe("update()", () => {
    it("updates series fields", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(mockSeries)
      mockPrisma.series.update.mockResolvedValue({
        ...mockSeries,
        title: "New Title",
      })

      const result = await service.update("creator_1", "series_1", {
        title: "New Title",
        type: SeriesTypeDto.SHORT_SERIES,
      })

      expect(result.title).toBe("New Title")
    })

    it("throws ForbiddenException when not owner", async () => {
      mockPrisma.series.findUnique.mockResolvedValue({
        ...mockSeries,
        creatorId: "other",
      })

      await expect(
        service.update("creator_1", "series_1", {
          title: "X",
          type: SeriesTypeDto.SHORT_SERIES,
        })
      ).rejects.toThrow(ForbiddenException)
    })
  })

  // -------------------------------------------------------------------------
  // publish
  // -------------------------------------------------------------------------

  describe("publish()", () => {
    beforeEach(() => {
      mockPrisma.series.findUnique.mockResolvedValue({
        creatorId: "creator_1",
      })
      mockPrisma.episode.findMany.mockResolvedValue([])
    })

    it("always submits series for admin review", async () => {
      mockPrisma.series.update.mockResolvedValue({
        ...mockSeries,
        status: "in_review",
      })

      const result = await service.publish("creator_1", "series_1")
      expect(result.status).toBe("in_review")
      expect(mockPrisma.series.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: "in_review" },
        })
      )
    })

    it("throws when episodes are not ready", async () => {
      mockPrisma.episode.findMany.mockResolvedValue([{ status: "processing" }])

      await expect(service.publish("creator_1", "series_1")).rejects.toThrow(
        "All episodes must finish processing before publishing"
      )
    })
  })

  // -------------------------------------------------------------------------
  // archive
  // -------------------------------------------------------------------------

  describe("archive()", () => {
    it("sets status to archived", async () => {
      mockPrisma.series.findUnique.mockResolvedValue({
        creatorId: "creator_1",
      })
      mockPrisma.series.findUniqueOrThrow.mockResolvedValue({
        status: "draft",
      })
      mockPrisma.series.update.mockResolvedValue({
        ...mockSeries,
        status: "archived",
      })

      const result = await service.archive("creator_1", "series_1")
      expect(result.status).toBe("archived")
      expect(mockPrisma.series.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "archived",
            statusBeforeArchive: "draft",
          }),
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------

  describe("remove()", () => {
    it("deletes the series", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(mockSeries)
      mockPrisma.series.delete.mockResolvedValue(mockSeries)

      await service.remove("creator_1", "series_1")

      expect(mockPrisma.series.delete).toHaveBeenCalledWith({
        where: { id: "series_1" },
      })
    })
  })

  // -------------------------------------------------------------------------
  // findAllPublic
  // -------------------------------------------------------------------------

  describe("findAllPublic()", () => {
    it("filters by genres via seriesGenres relation", async () => {
      mockPrisma.series.findMany.mockResolvedValue([mockSeries])

      await service.findAllPublic({ genres: ["Drama", "Romance"] })

      expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            seriesGenres: {
              some: { genre: { name: { in: ["Drama", "Romance"] } } },
            },
          }),
        })
      )
    })

    it("searches title and synopsis when q is provided", async () => {
      mockPrisma.series.findMany.mockResolvedValue([])

      await service.findAllPublic({ q: "lagos" })

      expect(mockPrisma.series.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            listedInSearch: true,
            OR: [
              { title: { contains: "lagos", mode: "insensitive" } },
              { synopsis: { contains: "lagos", mode: "insensitive" } },
            ],
          }),
        })
      )
    })
  })

  describe("findPublicGenres()", () => {
    it("returns active genres with counts from the database", async () => {
      mockPrisma.genre.findMany.mockResolvedValue([
        { id: "genre_drama", name: "Drama" },
        { id: "genre_comedy", name: "Comedy" },
      ])
      mockPrisma.seriesGenre.groupBy.mockResolvedValue([
        { genreId: "genre_drama", _count: { genreId: 3 } },
        { genreId: "genre_comedy", _count: { genreId: 1 } },
      ])

      const result = await service.findPublicGenres()

      expect(result).toEqual([
        { id: "genre_drama", name: "Drama", seriesCount: 3 },
        { id: "genre_comedy", name: "Comedy", seriesCount: 1 },
      ])
    })
  })

  // -------------------------------------------------------------------------
  // updateSettings
  // -------------------------------------------------------------------------

  describe("updateSettings()", () => {
    it("updates visibility settings", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(mockSeries)
      mockPrisma.series.update.mockResolvedValue({
        ...mockSeries,
        commentsEnabled: false,
      })

      const result = await service.updateSettings("creator_1", "series_1", {
        commentsEnabled: false,
      })

      expect(result.commentsEnabled).toBe(false)
    })
  })
})
