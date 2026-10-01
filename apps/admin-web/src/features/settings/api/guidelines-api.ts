import type {
  GuidelinesContent,
  UpdateGuidelinesRequest,
} from "@sable/contracts"
import { apiRequest } from "@/lib/http-client"

export function getGuidelines(): Promise<GuidelinesContent> {
  return apiRequest<GuidelinesContent>("/api/v1/guidelines")
}

export function updateGuidelines(
  body: UpdateGuidelinesRequest
): Promise<GuidelinesContent> {
  return apiRequest<GuidelinesContent>("/api/v1/admin/guidelines", {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}
