import type { WorkspaceRoleId } from "@/features/workspaces/types"

export function resolveAdminInboxHref(
  role: WorkspaceRoleId,
  link: string | null
): string | null {
  if (!link) return null
  if (link.startsWith("/dashboard") || link.startsWith("/auth")) return null
  if (link.startsWith("/workspace/")) {
    return link.replace(/^\/workspace\/[^/?]+/, `/workspace/${role}`)
  }
  if (link.startsWith("/")) {
    return `/workspace/${role}${link}`
  }
  return null
}

export function withSupportTicketHint(href: string | null, body: string) {
  if (!href || href.includes("ticket=")) return href
  if (!href.includes("/support")) return href
  const match = body.match(/\((SUP-[A-Z0-9]+)\)/i)
  if (!match) return href
  return `${href}${href.includes("?") ? "&" : "?"}ticket=${match[1]}`
}
