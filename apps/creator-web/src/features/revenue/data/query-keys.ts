export const revenueKeys = {
  all: ["revenue"] as const,
  dashboard: () => [...revenueKeys.all, "dashboard"] as const,
}
