import { MOCK_DASHBOARD_HOME } from "@/features/dashboard/data/mock-home"
import type { SettingsDashboardData } from "../types"

export const MOCK_SETTINGS_DASHBOARD: SettingsDashboardData = {
  workspace: {
    id: "lucid",
    name: "Lucid Productions",
    initials: "LP",
    role: "Owner",
  },
  profile: {
    initials: "AO",
    firstName: "Adaeze",
    lastName: "Okonkwo",
    displayName: "@adaeze_creates",
    bio: "Filmmaker & storyteller. Creating African narratives for the world.",
    email: "adaeze@example.com",
    phone: "+234 801 234 5678",
    socialLinks: [
      { platform: "Instagram", url: "" },
      { platform: "Twitter / X", url: "" },
      { platform: "YouTube", url: "" },
      { platform: "TikTok", url: "" },
    ],
  },
  studio: {
    name: "Lucid Productions",
    handle: "lucid-productions",
    description: "Creating premium African drama series for global audiences.",
    studioId: "studio_lucid_8_x7k2m",
    tier: "Pro Plan",
    teamMembers: [
      {
        id: "tm-1",
        name: "Adaeze Okonkwo",
        email: "adaeze@example.com",
        initials: "AO",
        role: "Owner",
      },
      {
        id: "tm-2",
        name: "Chidi Eze",
        email: "chidi@example.com",
        initials: "CE",
        role: "Editor",
      },
      {
        id: "tm-3",
        name: "Ngozi Ibe",
        email: "ngozi@example.com",
        initials: "NI",
        role: "Viewer",
      },
    ],
  },
  notifications: [
    {
      id: "channels",
      title: "Notification Channels",
      description: "Choose how you receive notifications",
      icon: "mail",
      items: [
        {
          id: "email",
          label: "Email Notifications",
          description: "Receive updates via email",
          enabled: true,
          icon: "mail",
        },
        {
          id: "push",
          label: "Push Notifications",
          description: "Browser and mobile push alerts",
          enabled: false,
          icon: "phone",
        },
        {
          id: "in-app",
          label: "In-App Notifications",
          description: "Notifications inside OrlAf dashboard",
          enabled: true,
          icon: "bell",
        },
      ],
    },
    {
      id: "content",
      title: "Content & Publishing",
      items: [
        {
          id: "episode-published",
          label: "Episode published successfully",
          description: "Get notified when your upload finishes processing",
          enabled: true,
        },
        {
          id: "new-comments",
          label: "New comments on your series",
          description: "When viewers leave comments on your episodes",
          enabled: true,
        },
        {
          id: "flagged",
          label: "Content flagged for review",
          description: "If any of your content is flagged by the community",
          enabled: true,
        },
      ],
    },
    {
      id: "revenue",
      title: "Revenue & Payouts",
      items: [
        {
          id: "payout-processed",
          label: "Payout processed",
          description: "When your scheduled payout has been sent",
          enabled: true,
        },
        {
          id: "coin-purchases",
          label: "New coin purchases",
          description: "When viewers buy coins on your gated content",
          enabled: false,
        },
        {
          id: "milestone",
          label: "Revenue milestone reached",
          description: "Celebrate when you hit earning milestones",
          enabled: true,
        },
      ],
    },
    {
      id: "audience",
      title: "Audience & Growth",
      items: [
        {
          id: "subscriber-milestone",
          label: "New subscriber milestone",
          description: "Get notified at 100, 1K, 10K, 100K subscribers",
          enabled: true,
        },
        {
          id: "weekly-digest",
          label: "Weekly analytics digest",
          description: "A summary of your performance every Monday",
          enabled: true,
        },
        {
          id: "trending",
          label: "Series trending notification",
          description: "When your series appears in trending",
          enabled: true,
        },
      ],
    },
    {
      id: "team",
      title: "Team & Studio",
      items: [
        {
          id: "team-joined",
          label: "New team member joined",
          description: "When someone accepts your studio invite",
          enabled: true,
        },
        {
          id: "permission-changed",
          label: "Permission changes",
          description: "When your role or access level is updated",
          enabled: true,
        },
      ],
    },
  ],
  security: {
    password: {
      current: "********",
      next: "********",
      confirm: "********",
    },
    methods: [
      {
        id: "auth-app",
        label: "Authenticator App",
        description: "Use Google Authenticator or Authy",
        icon: "key",
      },
      {
        id: "sms",
        label: "SMS Verification",
        description: "Receive codes via text message",
        icon: "phone",
      },
    ],
    sessions: [
      {
        id: "s1",
        device: "MacBook Pro — Chrome",
        location: "Lagos, Nigeria",
        lastActive: "Now",
        current: true,
      },
      {
        id: "s2",
        device: "iPhone 15 — Safari",
        location: "Lagos, Nigeria",
        lastActive: "2 hours ago",
      },
      {
        id: "s3",
        device: "Windows PC — Edge",
        location: "Accra, Ghana",
        lastActive: "3 days ago",
      },
    ],
  },
  preferences: {
    defaultLanguage: "English",
    defaultVisibility: "Public",
    commentsEnabledByDefault: true,
    autoPublishAfterProcessing: false,
    tippingEnabledByDefault: true,
    dashboardLanguage: "English",
    timezone: "West Africa Time (WAT)",
    reducedMotion: false,
  },
  earnMoreCards: MOCK_DASHBOARD_HOME.earnMoreCards,
}
