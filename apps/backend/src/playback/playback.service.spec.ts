import { BadRequestException, NotFoundException } from "@nestjs/common"
import { PlaybackService } from "./playback.service"

const mockEpisode = {
  id: "ep_1",
  seriesId: "series_1",
  durationSeconds: 120,
  archivedAt: null,
  series: {
    id: "series_1",
    creatorId: "creator_1",
    status: "published",
    isPublic: true,
    archivedAt: null,
  },
}

const mockPrisma = {
  episode: {
    findUnique: jest.fn(),
  },
  playbackSession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}

describe("PlaybackService", () => {
  let service: PlaybackService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new PlaybackService(mockPrisma as any)
    mockPrisma.episode.findUnique.mockResolvedValue(mockEpisode)
  })

  describe("startSession()", () => {
    it("creates a session for authenticated viewers", async () => {
      mockPrisma.playbackSession.create.mockResolvedValue({ id: "sess_1" })

      const result = await service.startSession(
        {
          episode_id: "ep_1",
          device_type: "mobile",
          platform: "ios",
          source: "series",
        },
        "acc_1"
      )

      expect(result.session_id).toBe("sess_1")
      expect(mockPrisma.playbackSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            episodeId: "ep_1",
            seriesId: "series_1",
            creatorId: "creator_1",
            accountId: "acc_1",
            durationSeconds: 120,
          }),
        })
      )
    })

    it("requires anon_id when unauthenticated", async () => {
      await expect(
        service.startSession({
          episode_id: "ep_1",
          device_type: "mobile",
        })
      ).rejects.toThrow(BadRequestException)
    })

    it("throws when episode is not engageable", async () => {
      mockPrisma.episode.findUnique.mockResolvedValue(null)
      await expect(
        service.startSession(
          {
            episode_id: "missing",
            device_type: "mobile",
            anon_id: "anon_1",
          },
          undefined
        )
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe("heartbeat()", () => {
    const baseSession = {
      id: "sess_1",
      accountId: "acc_1",
      anonId: "anon_1",
      watchedSeconds: 1,
      maxPositionSeconds: 1,
      durationSeconds: 100,
      countedAsView: false,
      completed: false,
      endedAt: null,
    }

    it("marks countedAsView once threshold is reached", async () => {
      mockPrisma.playbackSession.findUnique.mockResolvedValue(baseSession)
      mockPrisma.playbackSession.update.mockResolvedValue({
        id: "sess_1",
        countedAsView: true,
      })

      const result = await service.heartbeat(
        "sess_1",
        {
          watched_seconds: 3,
          max_position_seconds: 4,
        },
        "acc_1"
      )

      expect(result.counted_as_view).toBe(true)
      expect(mockPrisma.playbackSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            watchedSeconds: 3,
            countedAsView: true,
          }),
        })
      )
    })

    it("rejects decreasing watched_seconds", async () => {
      mockPrisma.playbackSession.findUnique.mockResolvedValue(baseSession)
      await expect(
        service.heartbeat(
          "sess_1",
          { watched_seconds: 0, max_position_seconds: 2 },
          "acc_1"
        )
      ).rejects.toThrow(BadRequestException)
    })

    it("caps watched_seconds at 1.2x duration", async () => {
      mockPrisma.playbackSession.findUnique.mockResolvedValue(baseSession)
      mockPrisma.playbackSession.update.mockResolvedValue({
        id: "sess_1",
        countedAsView: true,
      })

      await service.heartbeat(
        "sess_1",
        {
          watched_seconds: 999,
          max_position_seconds: 90,
          completed: true,
        },
        "acc_1"
      )

      expect(mockPrisma.playbackSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            watchedSeconds: 120,
            completed: true,
          }),
        })
      )
    })

    it("sets endedAt when ended is true", async () => {
      mockPrisma.playbackSession.findUnique.mockResolvedValue(baseSession)
      mockPrisma.playbackSession.update.mockResolvedValue({
        id: "sess_1",
        countedAsView: true,
      })

      await service.heartbeat(
        "sess_1",
        {
          watched_seconds: 10,
          max_position_seconds: 10,
          ended: true,
        },
        "acc_1"
      )

      expect(mockPrisma.playbackSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            endedAt: expect.any(Date),
          }),
        })
      )
    })
  })
})
