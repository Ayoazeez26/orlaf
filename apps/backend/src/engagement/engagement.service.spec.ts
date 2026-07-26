import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common"
import { EngagementService } from "./engagement.service"

const mockSeries = {
  id: "series_1",
  status: "published",
  isPublic: true,
  archivedAt: null,
  commentsEnabled: true,
}

const mockAccount = {
  id: "acc_1",
  displayName: "@adaeze",
  firstName: "Adaeze",
  lastName: "O",
  avatarUrl: null,
}

const mockPrisma = {
  series: {
    findUnique: jest.fn(),
  },
  seriesLike: {
    count: jest.fn(),
    findUnique: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
  },
  comment: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  commentLike: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  shareEvent: {
    count: jest.fn(),
    create: jest.fn(),
  },
  watchlistEntry: {
    count: jest.fn(),
    findUnique: jest.fn(),
  },
}

describe("EngagementService", () => {
  let service: EngagementService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new EngagementService(mockPrisma as any)
    mockPrisma.series.findUnique.mockResolvedValue(mockSeries)
  })

  describe("getSummary()", () => {
    it("returns aggregate counts, liked_by_me and saved_by_me", async () => {
      mockPrisma.seriesLike.count.mockResolvedValue(12)
      mockPrisma.comment.count.mockResolvedValue(4)
      mockPrisma.shareEvent.count.mockResolvedValue(7)
      mockPrisma.watchlistEntry.count.mockResolvedValue(9)
      mockPrisma.seriesLike.findUnique.mockResolvedValue({ id: "like_1" })
      mockPrisma.watchlistEntry.findUnique.mockResolvedValue({ id: "wl_1" })

      const result = await service.getSummary("series_1", "acc_1")

      expect(result).toEqual({
        series_id: "series_1",
        like_count: 12,
        comment_count: 4,
        share_count: 7,
        save_count: 9,
        liked_by_me: true,
        saved_by_me: true,
      })
    })

    it("reports save_count with saved_by_me false for guests", async () => {
      mockPrisma.seriesLike.count.mockResolvedValue(0)
      mockPrisma.comment.count.mockResolvedValue(0)
      mockPrisma.shareEvent.count.mockResolvedValue(0)
      mockPrisma.watchlistEntry.count.mockResolvedValue(5)

      const result = await service.getSummary("series_1")

      expect(result.save_count).toBe(5)
      expect(result.saved_by_me).toBe(false)
      expect(mockPrisma.watchlistEntry.findUnique).not.toHaveBeenCalled()
    })

    it("throws when series is not engageable", async () => {
      mockPrisma.series.findUnique.mockResolvedValue(null)
      await expect(service.getSummary("missing")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("likeSeries() / unlikeSeries()", () => {
    it("upserts a like", async () => {
      mockPrisma.seriesLike.upsert.mockResolvedValue({})
      await service.likeSeries("acc_1", "series_1")
      expect(mockPrisma.seriesLike.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            accountId_seriesId: { accountId: "acc_1", seriesId: "series_1" },
          },
        })
      )
    })

    it("deletes an existing like", async () => {
      mockPrisma.seriesLike.findUnique.mockResolvedValue({ id: "like_1" })
      mockPrisma.seriesLike.delete.mockResolvedValue({})
      await service.unlikeSeries("acc_1", "series_1")
      expect(mockPrisma.seriesLike.delete).toHaveBeenCalledWith({
        where: { id: "like_1" },
      })
    })

    it("throws when unliking a missing like", async () => {
      mockPrisma.seriesLike.findUnique.mockResolvedValue(null)
      await expect(service.unlikeSeries("acc_1", "series_1")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  describe("createComment()", () => {
    it("creates a top-level comment", async () => {
      mockPrisma.comment.create.mockResolvedValue({
        id: "c1",
        seriesId: "series_1",
        parentId: null,
        body: "Great episode",
        pinnedAt: null,
        deletedAt: null,
        createdAt: new Date("2026-07-25T12:00:00.000Z"),
        accountId: "acc_1",
        account: mockAccount,
        parent: null,
        _count: { likes: 0, replies: 0 },
        likes: [],
      })

      const result = await service.createComment("acc_1", "series_1", {
        body: "Great episode",
      })

      expect(result.body).toBe("Great episode")
      expect(result.is_mine).toBe(true)
      expect(result.author.display_name).toBe("@adaeze")
    })

    it("rejects blank body", async () => {
      await expect(
        service.createComment("acc_1", "series_1", { body: "   " })
      ).rejects.toThrow(BadRequestException)
    })

    it("rejects when comments are disabled", async () => {
      mockPrisma.series.findUnique.mockResolvedValue({
        ...mockSeries,
        commentsEnabled: false,
      })
      await expect(
        service.createComment("acc_1", "series_1", { body: "Hi" })
      ).rejects.toThrow(ForbiddenException)
    })

    it("rejects nesting deeper than reply-to-reply", async () => {
      mockPrisma.comment.findFirst.mockResolvedValue({
        id: "reply_of_reply",
        parentId: "reply",
        parent: { parentId: "root" },
      })

      await expect(
        service.createComment("acc_1", "series_1", {
          body: "too deep",
          parent_id: "reply_of_reply",
        })
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe("deleteComment()", () => {
    it("soft-deletes own comment", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: "c1",
        accountId: "acc_1",
        deletedAt: null,
      })
      mockPrisma.comment.update.mockResolvedValue({})

      await service.deleteComment("acc_1", "c1")

      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: "c1" },
        data: { deletedAt: expect.any(Date), body: "" },
      })
    })

    it("forbids deleting someone else's comment", async () => {
      mockPrisma.comment.findUnique.mockResolvedValue({
        id: "c1",
        accountId: "acc_other",
        deletedAt: null,
      })

      await expect(service.deleteComment("acc_1", "c1")).rejects.toThrow(
        ForbiddenException
      )
    })
  })

  describe("recordShare()", () => {
    it("creates a share event with optional account", async () => {
      mockPrisma.shareEvent.create.mockResolvedValue({})
      await service.recordShare("series_1", { channel: "whatsapp" }, "acc_1")
      expect(mockPrisma.shareEvent.create).toHaveBeenCalledWith({
        data: {
          seriesId: "series_1",
          accountId: "acc_1",
          channel: "whatsapp",
        },
      })
    })

    it("allows anonymous shares", async () => {
      mockPrisma.shareEvent.create.mockResolvedValue({})
      await service.recordShare("series_1", { channel: "copy" })
      expect(mockPrisma.shareEvent.create).toHaveBeenCalledWith({
        data: {
          seriesId: "series_1",
          accountId: null,
          channel: "copy",
        },
      })
    })
  })

  describe("listComments()", () => {
    it("returns top-level comments with nested replies", async () => {
      const root = {
        id: "root_1",
        seriesId: "series_1",
        parentId: null,
        body: "Top",
        pinnedAt: null,
        deletedAt: null,
        createdAt: new Date("2026-07-25T10:00:00.000Z"),
        accountId: "acc_1",
        account: mockAccount,
        parent: null,
        _count: { likes: 2, replies: 1 },
        likes: [{ id: "cl1" }],
      }
      const reply = {
        id: "reply_1",
        seriesId: "series_1",
        parentId: "root_1",
        body: "Nested",
        pinnedAt: null,
        deletedAt: null,
        createdAt: new Date("2026-07-25T11:00:00.000Z"),
        accountId: "acc_2",
        account: {
          ...mockAccount,
          id: "acc_2",
          displayName: "@bob",
        },
        parent: {
          id: "root_1",
          parentId: null,
          account: mockAccount,
        },
        _count: { likes: 0, replies: 0 },
        likes: [],
      }

      mockPrisma.comment.findMany
        .mockResolvedValueOnce([root])
        .mockResolvedValueOnce([reply])

      const result = await service.listComments("series_1", {
        accountId: "acc_1",
      })

      expect(result.items).toHaveLength(1)
      expect(result.items[0].liked_by_me).toBe(true)
      expect(result.items[0].replies).toHaveLength(1)
      expect(result.items[0].replies?.[0].reply_to_author).toBe("@adaeze")
      expect(result.items[0].reply_count).toBe(1)
    })
  })
})
