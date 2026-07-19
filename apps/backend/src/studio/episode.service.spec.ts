import { ForbiddenException, NotFoundException } from "@nestjs/common"
import { EpisodeService } from "./episode.service"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSeries = {
  id: "series_1",
  creatorId: "creator_1",
}

const mockEpisode = {
  id: "ep_1",
  seriesId: "series_1",
  title: "The Awakening",
  synopsis: "A young woman returns...",
  order: 0,
  status: "pending",
  accessType: "free",
  coinPrice: null,
  videoHostingId: null,
  hlsUrl: null,
  dashUrl: null,
  thumbnailUrl: null,
  durationSeconds: null,
  fileSizeBytes: null,
  width: null,
  height: null,
  aiVerticalConversion: true,
  subtitleTracks: [],
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  series: {
    findUnique: jest.fn(),
  },
  episode: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((ops: any[]) => Promise.all(ops)),
}

const mockVideoHosting = {
  createVideo: jest.fn(),
  getVideoMetadata: jest.fn(),
  deleteVideo: jest.fn(),
  getSignedPlaybackUrl: jest.fn(),
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("EpisodeService", () => {
  let service: EpisodeService

  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.series.findUnique.mockResolvedValue(mockSeries)
    service = new EpisodeService(mockPrisma as any, mockVideoHosting as any)
  })

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------

  describe("create()", () => {
    it("creates an episode with correct order", async () => {
      mockPrisma.episode.count.mockResolvedValue(2)
      mockPrisma.episode.create.mockResolvedValue({ ...mockEpisode, order: 2 })

      const result = await service.create("creator_1", "series_1", {
        title: "The Awakening",
      })

      expect(result.order).toBe(2)
      expect(mockPrisma.episode.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            order: 2,
            seriesId: "series_1",
          }),
        })
      )
    })

    it("throws ForbiddenException when not series owner", async () => {
      mockPrisma.series.findUnique.mockResolvedValue({
        ...mockSeries,
        creatorId: "other",
      })

      await expect(
        service.create("creator_1", "series_1", { title: "X" })
      ).rejects.toThrow(ForbiddenException)
    })
  })

  // -------------------------------------------------------------------------
  // findAll
  // -------------------------------------------------------------------------

  describe("findAll()", () => {
    it("returns episodes ordered by order field", async () => {
      mockPrisma.episode.findMany.mockResolvedValue([mockEpisode])

      const result = await service.findAll("creator_1", "series_1")

      expect(result).toHaveLength(1)
      expect(mockPrisma.episode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { order: "asc" },
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------

  describe("remove()", () => {
    it("deletes video from hosting provider when video exists", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue({
        ...mockEpisode,
        videoHostingId: "cf_video_123",
      })
      mockVideoHosting.deleteVideo.mockResolvedValue(undefined)
      mockPrisma.episode.delete.mockResolvedValue(mockEpisode)

      await service.remove("creator_1", "series_1", "ep_1")

      expect(mockVideoHosting.deleteVideo).toHaveBeenCalledWith("cf_video_123")
      expect(mockPrisma.episode.delete).toHaveBeenCalledWith({
        where: { id: "ep_1" },
      })
    })

    it("still deletes episode even if video hosting delete fails", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue({
        ...mockEpisode,
        videoHostingId: "cf_video_123",
      })
      mockVideoHosting.deleteVideo.mockRejectedValue(
        new Error("Provider error")
      )
      mockPrisma.episode.delete.mockResolvedValue(mockEpisode)

      await expect(
        service.remove("creator_1", "series_1", "ep_1")
      ).resolves.not.toThrow()

      expect(mockPrisma.episode.delete).toHaveBeenCalled()
    })

    it("throws NotFoundException when episode not found", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue(null)

      await expect(
        service.remove("creator_1", "series_1", "nonexistent")
      ).rejects.toThrow(NotFoundException)
    })
  })

  // -------------------------------------------------------------------------
  // reorder
  // -------------------------------------------------------------------------

  describe("reorder()", () => {
    it("updates order for each episode", async () => {
      mockPrisma.episode.update.mockResolvedValue({})
      mockPrisma.$transaction.mockImplementation((ops: any[]) =>
        Promise.all(ops)
      )

      await service.reorder("creator_1", "series_1", {
        episodeIds: ["ep_3", "ep_1", "ep_2"],
      })

      expect(mockPrisma.$transaction).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // createUploadUrl
  // -------------------------------------------------------------------------

  describe("createUploadUrl()", () => {
    it("creates a video in the hosting provider and returns upload URL", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue(mockEpisode)
      mockVideoHosting.createVideo.mockResolvedValue({
        videoId: "cf_uid_abc",
        uploadUrl: "https://upload.cloudflare.com/abc",
        hlsUrl: null,
      })
      mockPrisma.episode.update.mockResolvedValue({
        ...mockEpisode,
        videoHostingId: "cf_uid_abc",
        status: "uploading",
      })

      const result = await service.createUploadUrl(
        "creator_1",
        "series_1",
        "ep_1"
      )

      expect(result.uploadUrl).toBe("https://upload.cloudflare.com/abc")
      expect(result.videoId).toBe("cf_uid_abc")
      expect(mockPrisma.episode.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "uploading",
            videoHostingId: "cf_uid_abc",
          }),
        })
      )
    })
  })

  // -------------------------------------------------------------------------
  // handleVideoWebhook
  // -------------------------------------------------------------------------

  describe("handleVideoWebhook()", () => {
    it("marks episode as ready when transcode completes", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue({
        ...mockEpisode,
        videoHostingId: "cf_uid_abc",
      })
      mockPrisma.episode.update.mockResolvedValue({
        ...mockEpisode,
        status: "ready",
        hlsUrl: "https://customer.cloudflarestream.com/abc/manifest/video.m3u8",
      })

      await service.handleVideoWebhook({
        uid: "cf_uid_abc",
        status: "ready",
        playback: {
          hls: "https://customer.cloudflarestream.com/abc/manifest/video.m3u8",
        },
        duration: 272.5,
        input: { width: 1080, height: 1920 },
        thumbnail:
          "https://customer.cloudflarestream.com/abc/thumbnails/thumbnail.jpg",
      })

      expect(mockPrisma.episode.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "ready",
            hlsUrl:
              "https://customer.cloudflarestream.com/abc/manifest/video.m3u8",
            durationSeconds: 272.5,
          }),
        })
      )
    })

    it("marks episode as failed on error status", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue({
        ...mockEpisode,
        videoHostingId: "cf_uid_abc",
      })
      mockPrisma.episode.update.mockResolvedValue({})

      await service.handleVideoWebhook({
        uid: "cf_uid_abc",
        status: "error",
      })

      expect(mockPrisma.episode.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "failed" }),
        })
      )
    })

    it("is a no-op when video ID not found", async () => {
      mockPrisma.episode.findFirst.mockResolvedValue(null)

      await service.handleVideoWebhook({
        uid: "unknown_uid",
        status: "ready",
      })

      expect(mockPrisma.episode.update).not.toHaveBeenCalled()
    })
  })
})
