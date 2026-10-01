import type { GuidelinesContent } from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function getGuidelines(): Promise<GuidelinesContent> {
  return apiRequest<GuidelinesContent>("/api/v1/guidelines")
}
