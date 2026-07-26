import { AdminAnalyticsService } from "./admin-analytics.service"

const mockPrisma = {
  account: {
    count: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

describe("AdminAnalyticsService", () => {
  let service: AdminAnalyticsService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new AdminAnalyticsService(mockPrisma as never)
    mockPrisma.account.count.mockResolvedValue(0)
    mockPrisma.$queryRaw.mockResolvedValue([])
  })

  it("returns new_users / new_creators KPIs with change percents", async () => {
    mockPrisma.account.count
      .mockResolvedValueOnce(100) // users current
      .mockResolvedValueOnce(50) // users previous
      .mockResolvedValueOnce(20) // creators current
      .mockResolvedValueOnce(10) // creators previous

    const result = await service.getOverview("30d")

    expect(result.range.key).toBe("30d")
    expect(result.kpis.new_users.value).toBe(100)
    expect(result.kpis.new_users.change_percent).toBe(100)
    expect(result.kpis.new_creators.value).toBe(20)
    expect(result.kpis.new_creators.change_percent).toBe(100)
    expect(result.user_growth.length).toBeGreaterThan(0)
    expect(result.user_growth[0]).toMatchObject({
      users: 0,
      creators: 0,
    })
  })

  it("returns null change_percent when previous period is zero", async () => {
    mockPrisma.account.count
      .mockResolvedValueOnce(12)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(0)

    const result = await service.getOverview("7d")

    expect(result.kpis.new_users.change_percent).toBeNull()
    expect(result.kpis.new_creators.change_percent).toBeNull()
    expect(result.user_growth.length).toBeGreaterThanOrEqual(7)
    expect(result.user_growth.length).toBeLessThanOrEqual(8)
  })

  it("maps raw growth buckets into filled series", async () => {
    const weekStart = new Date()
    weekStart.setUTCHours(0, 0, 0, 0)
    const day = weekStart.getUTCDay()
    weekStart.setUTCDate(weekStart.getUTCDate() - ((day + 6) % 7))

    mockPrisma.account.count.mockResolvedValue(0)
    mockPrisma.$queryRaw.mockResolvedValue([
      {
        bucket: weekStart,
        users: BigInt(40),
        creators: BigInt(2),
      },
    ])

    const result = await service.getOverview("30d")
    const hit = result.user_growth.find(
      (point) => point.bucket === weekStart.toISOString().slice(0, 10)
    )

    expect(hit?.users).toBe(40)
    expect(hit?.creators).toBe(2)
  })
})
