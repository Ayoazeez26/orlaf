import { AnalyticsService } from "./analytics.service"

const mockPrisma = {
  playbackSession: {
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  seriesLike: {
    count: jest.fn(),
  },
  comment: {
    count: jest.fn(),
  },
  shareEvent: {
    count: jest.fn(),
  },
  episode: {
    findMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

describe("AnalyticsService", () => {
  let service: AnalyticsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AnalyticsService(mockPrisma as any)

    mockPrisma.playbackSession.count.mockResolvedValue(100)
    mockPrisma.playbackSession.aggregate.mockResolvedValue({
      _sum: { watchedSeconds: 12_000 },
    })
    mockPrisma.seriesLike.count.mockResolvedValue(10)
    mockPrisma.comment.count.mockResolvedValue(5)
    mockPrisma.shareEvent.count.mockResolvedValue(5)
    mockPrisma.$queryRaw.mockResolvedValue([{ count: BigInt(40) }])
    mockPrisma.playbackSession.groupBy.mockResolvedValue([])
    mockPrisma.episode.findMany.mockResolvedValue([])
  })

  it("returns overview KPIs with change percents", async () => {
    mockPrisma.playbackSession.count
      .mockResolvedValueOnce(100) // current views
      .mockResolvedValueOnce(50) // previous views
    mockPrisma.$queryRaw
      .mockResolvedValueOnce([{ count: BigInt(40) }]) // current uniques
      .mockResolvedValueOnce([{ count: BigInt(20) }]) // previous uniques
      .mockResolvedValue([]) // trend / engagement raw queries

    mockPrisma.playbackSession.aggregate
      .mockResolvedValueOnce({ _sum: { watchedSeconds: 12_000 } })
      .mockResolvedValueOnce({ _sum: { watchedSeconds: 5_000 } })

    mockPrisma.seriesLike.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(4)
    mockPrisma.comment.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2)
    mockPrisma.shareEvent.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2)

    const result = await service.getOverview("creator_1", "30d")

    expect(result.range.key).toBe("30d")
    expect(result.kpis.total_views.value).toBe(100)
    expect(result.kpis.total_views.change_percent).toBe(100)
    expect(result.kpis.unique_viewers.value).toBe(40)
    expect(result.kpis.avg_watch_seconds.value).toBe(120)
    expect(result.kpis.engagement_rate.value).toBeCloseTo(0.2)
    expect(result.devices).toHaveLength(3)
  })

  it("returns null change_percent when previous is zero", async () => {
    mockPrisma.playbackSession.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(0)
    mockPrisma.$queryRaw
      .mockResolvedValueOnce([{ count: BigInt(5) }])
      .mockResolvedValueOnce([{ count: BigInt(0) }])
      .mockResolvedValue([])
    mockPrisma.playbackSession.aggregate
      .mockResolvedValueOnce({ _sum: { watchedSeconds: 100 } })
      .mockResolvedValueOnce({ _sum: { watchedSeconds: 0 } })
    mockPrisma.seriesLike.count.mockResolvedValue(0)
    mockPrisma.comment.count.mockResolvedValue(0)
    mockPrisma.shareEvent.count.mockResolvedValue(0)

    const result = await service.getOverview("creator_1", "7d")

    expect(result.kpis.total_views.change_percent).toBeNull()
  })

  it("maps top episodes with ranks", async () => {
    mockPrisma.$queryRaw.mockResolvedValue([])
    mockPrisma.playbackSession.groupBy
      .mockResolvedValueOnce([]) // devices
      .mockResolvedValueOnce([
        { episodeId: "ep_1", _count: { _all: 50 } },
        { episodeId: "ep_2", _count: { _all: 20 } },
      ])
      .mockResolvedValueOnce([
        { episodeId: "ep_1", _count: { _all: 25 } },
        { episodeId: "ep_2", _count: { _all: 40 } },
      ])
    mockPrisma.episode.findMany.mockResolvedValue([
      {
        id: "ep_1",
        title: "The Meeting",
        seriesId: "s1",
        series: { title: "Jollof Wars" },
      },
      {
        id: "ep_2",
        title: "The Contract",
        seriesId: "s1",
        series: { title: "Jollof Wars" },
      },
    ])

    const result = await service.getOverview("creator_1", "30d")

    expect(result.top_episodes).toEqual([
      expect.objectContaining({
        rank: 1,
        episode_id: "ep_1",
        episode_title: "The Meeting",
        views: 50,
        change_percent: 100,
      }),
      expect.objectContaining({
        rank: 2,
        episode_id: "ep_2",
        views: 20,
        change_percent: -50,
      }),
    ])
  })
})
