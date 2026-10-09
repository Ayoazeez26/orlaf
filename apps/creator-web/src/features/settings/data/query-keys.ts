export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  preferences: () => [...profileKeys.all, "preferences"] as const,
  notificationSettings: () =>
    [...profileKeys.all, "notification-settings"] as const,
}
