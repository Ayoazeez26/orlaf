import { ConflictException, NotFoundException } from "@nestjs/common"
import { ProfileService } from "./profile.service"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockAccount = {
  id: "acc_1",
  email: "adaeze@example.com",
  displayName: "@adaeze_creates",
  firstName: "Adaeze",
  lastName: "Okonkwo",
  avatarUrl: null,
  bio: "Filmmaker & storyteller.",
  phone: "+2348012345678",
  instagramUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  accountType: "creator",
  status: "active",
  createdAt: new Date(),
  creatorProfile: null,
}

const mockCreatorProfile = {
  accountId: "acc_1",
  studioName: "Lucid Productions",
  handle: "lucid-productions",
  description: "Creating premium African drama series.",
  logoUrl: null,
  plan: "free",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  account: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  creatorProfile: {
    findFirst: jest.fn(),
    upsert: jest.fn(),
  },
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

describe("ProfileService", () => {
  let service: ProfileService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new ProfileService(mockPrisma as any, mockVideoHosting as any)
  })

  // -------------------------------------------------------------------------
  // getProfile
  // -------------------------------------------------------------------------

  describe("getProfile()", () => {
    it("returns account with creator profile", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(mockAccount)

      const result = await service.getProfile("acc_1")

      expect(result.id).toBe("acc_1")
      expect(mockPrisma.account.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "acc_1" } })
      )
    })

    it("throws NotFoundException when account not found", async () => {
      mockPrisma.account.findUnique.mockResolvedValue(null)

      await expect(service.getProfile("nonexistent")).rejects.toThrow(
        NotFoundException
      )
    })
  })

  // -------------------------------------------------------------------------
  // updateProfile
  // -------------------------------------------------------------------------

  describe("updateProfile()", () => {
    it("updates personal profile fields", async () => {
      mockPrisma.account.update.mockResolvedValue({
        ...mockAccount,
        firstName: "Ada",
        bio: "Updated bio",
      })

      const result = await service.updateProfile("acc_1", {
        firstName: "Ada",
        bio: "Updated bio",
      })

      expect(result.firstName).toBe("Ada")
      expect(mockPrisma.account.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "acc_1" },
          data: expect.objectContaining({
            firstName: "Ada",
            bio: "Updated bio",
          }),
        })
      )
    })

    it("only updates provided fields", async () => {
      mockPrisma.account.update.mockResolvedValue(mockAccount)

      await service.updateProfile("acc_1", { firstName: "Ada" })

      const call = mockPrisma.account.update.mock.calls[0][0]
      expect(call.data).not.toHaveProperty("lastName")
      expect(call.data).not.toHaveProperty("bio")
    })
  })

  // -------------------------------------------------------------------------
  // updateSocialLinks
  // -------------------------------------------------------------------------

  describe("updateSocialLinks()", () => {
    it("updates social link fields", async () => {
      mockPrisma.account.update.mockResolvedValue({
        instagramUrl: "https://instagram.com/adaeze",
        twitterUrl: null,
        youtubeUrl: null,
        tiktokUrl: null,
      })

      const result = await service.updateSocialLinks("acc_1", {
        instagramUrl: "https://instagram.com/adaeze",
      })

      expect(result.instagramUrl).toBe("https://instagram.com/adaeze")
    })
  })

  // -------------------------------------------------------------------------
  // updateStudio
  // -------------------------------------------------------------------------

  describe("updateStudio()", () => {
    it("creates studio profile if not exists", async () => {
      mockPrisma.creatorProfile.findFirst.mockResolvedValue(null)
      mockPrisma.creatorProfile.upsert.mockResolvedValue(mockCreatorProfile)

      const result = await service.updateStudio("acc_1", {
        studioName: "Lucid Productions",
        handle: "lucid-productions",
      })

      expect(result.studioName).toBe("Lucid Productions")
      expect(mockPrisma.creatorProfile.upsert).toHaveBeenCalled()
    })

    it("throws ConflictException when handle is taken", async () => {
      mockPrisma.creatorProfile.findFirst.mockResolvedValue({
        accountId: "other_acc",
        handle: "lucid-productions",
      })

      await expect(
        service.updateStudio("acc_1", { handle: "lucid-productions" })
      ).rejects.toThrow(ConflictException)
    })

    it("allows updating own handle", async () => {
      // findFirst returns null because NOT { accountId } excludes current account
      mockPrisma.creatorProfile.findFirst.mockResolvedValue(null)
      mockPrisma.creatorProfile.upsert.mockResolvedValue({
        ...mockCreatorProfile,
        handle: "new-handle",
      })

      const result = await service.updateStudio("acc_1", {
        handle: "new-handle",
      })

      expect(result.handle).toBe("new-handle")
    })
  })

  // -------------------------------------------------------------------------
  // getAvatarUploadUrl
  // -------------------------------------------------------------------------

  describe("getAvatarUploadUrl()", () => {
    it("returns presigned upload URL for avatar", async () => {
      mockVideoHosting.createImageUploadUrl.mockResolvedValue({
        uploadUrl: "https://r2.example.com/upload",
        imageUrl: "https://media.sable.tv/avatars/acc_1.jpg",
      })

      const result = await service.getAvatarUploadUrl("acc_1", {
        contentType: "image/jpeg",
      })

      expect(result.uploadUrl).toBe("https://r2.example.com/upload")
      expect(result.imageUrl).toBe("https://media.sable.tv/avatars/acc_1.jpg")
      expect(mockVideoHosting.createImageUploadUrl).toHaveBeenCalledWith({
        creatorId: "acc_1",
        contentType: "image/jpeg",
      })
    })

    it("defaults to image/jpeg when contentType not provided", async () => {
      mockVideoHosting.createImageUploadUrl.mockResolvedValue({
        uploadUrl: "https://r2.example.com/upload",
        imageUrl: "https://media.sable.tv/avatars/acc_1.jpg",
      })

      await service.getAvatarUploadUrl("acc_1", {})

      expect(mockVideoHosting.createImageUploadUrl).toHaveBeenCalledWith(
        expect.objectContaining({ contentType: "image/jpeg" })
      )
    })
  })

  // -------------------------------------------------------------------------
  // getLogoUploadUrl
  // -------------------------------------------------------------------------

  describe("getLogoUploadUrl()", () => {
    it("returns presigned upload URL for studio logo", async () => {
      mockVideoHosting.createImageUploadUrl.mockResolvedValue({
        uploadUrl: "https://r2.example.com/upload",
        imageUrl: "https://media.sable.tv/logos/acc_1.jpg",
      })

      const result = await service.getLogoUploadUrl("acc_1", {
        contentType: "image/png",
      })

      expect(result.uploadUrl).toBeDefined()
      expect(mockVideoHosting.createImageUploadUrl).toHaveBeenCalledWith({
        creatorId: "acc_1",
        contentType: "image/png",
      })
    })
  })

  // -------------------------------------------------------------------------
  // preferences
  // -------------------------------------------------------------------------

  describe("getPreferences()", () => {
    it("returns mapped creator preferences", async () => {
      const updatedAt = new Date("2026-01-01")
      mockPrisma.creatorProfile.upsert.mockResolvedValue({
        defaultContentLanguage: "English",
        defaultVisibility: "public",
        commentsEnabledByDefault: true,
        autoPublishAfterProcessing: false,
        tippingEnabledByDefault: false,
        dashboardLanguage: "English",
        timezone: "Africa/Lagos",
        colorScheme: "system",
        reducedMotion: false,
        updatedAt,
      })

      const result = await service.getPreferences("acc_1")

      expect(result.defaultVisibility).toBe("public")
      expect(result.updatedAt).toBe(updatedAt.toISOString())
    })
  })

  describe("updatePreferences()", () => {
    it("persists preference updates", async () => {
      const updatedAt = new Date("2026-01-02")
      mockPrisma.creatorProfile.upsert.mockResolvedValue({
        defaultContentLanguage: "French",
        defaultVisibility: "private",
        commentsEnabledByDefault: false,
        autoPublishAfterProcessing: true,
        tippingEnabledByDefault: true,
        dashboardLanguage: "French",
        timezone: "Europe/London",
        colorScheme: "dark",
        reducedMotion: true,
        updatedAt,
      })

      const result = await service.updatePreferences("acc_1", {
        defaultContentLanguage: "French",
        defaultVisibility: "private",
        autoPublishAfterProcessing: true,
      })

      expect(result.defaultContentLanguage).toBe("French")
      expect(result.defaultVisibility).toBe("private")
      expect(result.autoPublishAfterProcessing).toBe(true)
      expect(mockPrisma.creatorProfile.upsert).toHaveBeenCalled()
    })
  })

  // -------------------------------------------------------------------------
  // notification settings
  // -------------------------------------------------------------------------

  describe("getNotificationSettings()", () => {
    it("returns mapped notification settings", async () => {
      const updatedAt = new Date("2026-01-01")
      mockPrisma.creatorProfile.upsert.mockResolvedValue({
        notifyEmailEnabled: true,
        notifyPushEnabled: false,
        notifyInAppEnabled: true,
        notifyEpisodePublished: true,
        notifyNewComments: true,
        notifyContentFlagged: true,
        notifyPayoutProcessed: true,
        notifyCoinPurchases: false,
        notifyRevenueMilestone: true,
        notifySubscriberMilestone: true,
        notifyWeeklyDigest: true,
        notifySeriesTrending: true,
        notifyTeamMemberJoined: true,
        notifyPermissionChanged: true,
        updatedAt,
      })

      const result = await service.getNotificationSettings("acc_1")

      expect(result.emailEnabled).toBe(true)
      expect(result.pushEnabled).toBe(false)
      expect(result.coinPurchasesEnabled).toBe(false)
      expect(result.updatedAt).toBe(updatedAt.toISOString())
    })
  })

  describe("updateNotificationSettings()", () => {
    it("persists notification setting updates", async () => {
      const updatedAt = new Date("2026-01-02")
      mockPrisma.creatorProfile.upsert.mockResolvedValue({
        notifyEmailEnabled: false,
        notifyPushEnabled: false,
        notifyInAppEnabled: true,
        notifyEpisodePublished: true,
        notifyNewComments: false,
        notifyContentFlagged: true,
        notifyPayoutProcessed: true,
        notifyCoinPurchases: true,
        notifyRevenueMilestone: true,
        notifySubscriberMilestone: true,
        notifyWeeklyDigest: true,
        notifySeriesTrending: true,
        notifyTeamMemberJoined: true,
        notifyPermissionChanged: true,
        updatedAt,
      })

      const result = await service.updateNotificationSettings("acc_1", {
        emailEnabled: false,
        newCommentsEnabled: false,
        coinPurchasesEnabled: true,
      })

      expect(result.emailEnabled).toBe(false)
      expect(result.newCommentsEnabled).toBe(false)
      expect(result.coinPurchasesEnabled).toBe(true)
      expect(mockPrisma.creatorProfile.upsert).toHaveBeenCalled()
    })

    it("rejects enabling push notifications", async () => {
      await expect(
        service.updateNotificationSettings("acc_1", { pushEnabled: true })
      ).rejects.toThrow("Push notifications are not available yet")
    })
  })
})
