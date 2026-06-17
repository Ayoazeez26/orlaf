export const promotionsKeys = {
  all: ["promotions"] as const,
  list: () => [...promotionsKeys.all, "list"] as const,
  detail: (id: string) => [...promotionsKeys.all, "detail", id] as const,
}
