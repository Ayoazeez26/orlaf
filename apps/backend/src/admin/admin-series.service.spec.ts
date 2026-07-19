import { BadRequestException, NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "../prisma/prisma.service"
import { AdminSeriesService } from "./admin-series.service"

const mockSeriesRow = {
  id: "series_1",
  title: "Zulu Dawn",
  synopsis: "A drama series",
  language: "English",
  status: "in_review" as const,
  posterUrl: null,
  publishedAt: null,
  adminActionNote: null,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  creator: {
    id: "creator_1",
    email: "adaeze@example.com",
    displayName: "Adaeze Okafor",
    firstName: "Adaeze",
    lastName: "Okafor",
    creatorProfile: { handle: "adaeze" },
  },
  seriesGenres: [{ genre: { name: "Drama" } }],
  episodes: [
    {
      id: "ep_1",
      order: 1,
      title: "Pilot",
      durationSeconds: 180,
      fileSizeBytes: BigInt(35_000_000),
      status: "ready" as const,
    },
  ],
  _count: { episodes: 1 },
}

describe("AdminSeriesService", () => {
  let service: AdminSeriesService

  const mockPrisma = {
    series: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminSeriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get(AdminSeriesService)
  })

  it("lists series with stats", async () => {
    mockPrisma.series.findMany.mockResolvedValue([mockSeriesRow])
    mockPrisma.series.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)

    const result = await service.list({ filter: "all" })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.reviewStatus).toBe("pending")
    expect(result.items[0]?.views).toBeNull()
    expect(result.stats.total).toBe(1)
  })

  it("returns detail with episodes", async () => {
    mockPrisma.series.findUnique.mockResolvedValue(mockSeriesRow)

    const detail = await service.getById("series_1")

    expect(detail.episodes).toHaveLength(1)
    expect(detail.creatorUsername).toBe("@adaeze")
    expect(detail.views).toBeNull()
  })

  it("publishes in_review series", async () => {
    mockPrisma.series.findUnique.mockResolvedValue({
      id: "series_1",
      status: "in_review",
      publishedAt: null,
    })
    mockPrisma.series.update.mockResolvedValue({
      ...mockSeriesRow,
      status: "published",
      publishedAt: new Date(),
    })

    const detail = await service.publish("series_1", "admin_1")

    expect(detail.publishStatus).toBe("published")
    expect(mockPrisma.series.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "published" }),
      })
    )
  })

  it("rejects pending series", async () => {
    mockPrisma.series.findUnique.mockResolvedValue({
      id: "series_1",
      status: "in_review",
      publishedAt: null,
    })
    mockPrisma.series.update.mockResolvedValue({
      ...mockSeriesRow,
      status: "rejected",
    })

    const detail = await service.reject("series_1", "admin_1", {
      note: "Guidelines",
    })

    expect(detail.reviewStatus).toBe("rejected")
  })

  it("unpublishes published series", async () => {
    mockPrisma.series.findUnique.mockResolvedValue({
      id: "series_1",
      status: "published",
      publishedAt: new Date(),
    })
    mockPrisma.series.update.mockResolvedValue({
      ...mockSeriesRow,
      status: "draft",
    })

    const detail = await service.unpublish("series_1", "admin_1")

    expect(detail.publishStatus).toBe("draft")
  })

  it("throws when unpublishing draft series", async () => {
    mockPrisma.series.findUnique.mockResolvedValue({
      id: "series_1",
      status: "draft",
      publishedAt: null,
    })

    await expect(
      service.unpublish("series_1", "admin_1")
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it("deletes series", async () => {
    mockPrisma.series.findUnique.mockResolvedValue({
      id: "series_1",
      status: "draft",
      publishedAt: null,
    })
    mockPrisma.series.delete.mockResolvedValue(undefined)

    await service.remove("series_1", "admin_1")

    expect(mockPrisma.series.delete).toHaveBeenCalledWith({
      where: { id: "series_1" },
    })
  })

  it("throws when series is missing", async () => {
    mockPrisma.series.findUnique.mockResolvedValue(null)

    await expect(service.getById("missing")).rejects.toBeInstanceOf(
      NotFoundException
    )
  })
})
