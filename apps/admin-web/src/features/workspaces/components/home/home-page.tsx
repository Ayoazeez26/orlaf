import type { AdminAnalyticsSummary, AuditLogEntry } from "@sable/contracts"
import { useAdminAnalyticsSummary } from "@/features/analytics/api/analytics-hooks"
import { useAuditLogQuery } from "@/features/audit-log/api/audit-hooks"
import { auditActionConfig } from "@/features/audit-log/constants"
import { applyAnalyticsSummary } from "../../lib/apply-analytics-summary"
import type { PanelItem, Tone, WorkspaceConfig } from "../../types"
import { HomePageSkeleton } from "../page-skeletons"
import { MetricCardsRow } from "./metric-cards-row"
import { PrimaryPanelCard } from "./primary-panel-card"
import { SideCard } from "./side-card"
import { WelcomeHeader } from "./welcome-header"

const EMPTY_SUMMARY: AdminAnalyticsSummary = {
  total_users: 0,
  total_creators: 0,
  published_series: 0,
  pending_review_series: 0,
  flagged_series: 0,
  views_30d: 0,
  new_creators_7d: 0,
}

function auditTone(action: AuditLogEntry["action"]): Tone {
  if (
    action.includes("rejected") ||
    action.includes("deleted") ||
    action.includes("suspended") ||
    action.includes("dismissed")
  ) {
    return "danger"
  }
  if (
    action.includes("published") ||
    action.includes("approved") ||
    action.includes("verified") ||
    action.includes("resolved")
  ) {
    return "positive"
  }
  if (action.includes("report")) return "warning"
  return "primary"
}

function mapAuditItems(entries: AuditLogEntry[]): PanelItem[] {
  return entries.map((entry) => {
    const config = auditActionConfig(entry.action)
    return {
      id: entry.id,
      title: config.label,
      subtitle: `${entry.target} · ${entry.userName}`,
      icon: config.icon,
      tone: auditTone(entry.action),
      trailing: entry.time,
    }
  })
}

interface HomePageProps {
  config: WorkspaceConfig
}

export function HomePage({ config }: HomePageProps) {
  const { data: summary, isPending } = useAdminAnalyticsSummary()
  const { data: audit } = useAuditLogQuery({ page: 1, pageSize: 6 })
  const homeConfig = applyAnalyticsSummary(config, summary ?? EMPTY_SUMMARY)
  const { home } = homeConfig
  const primary = {
    ...home.primary,
    items: mapAuditItems(audit?.items ?? []),
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <WelcomeHeader />
      {isPending ? (
        <HomePageSkeleton />
      ) : (
        <>
          <MetricCardsRow metrics={home.metrics} />
          <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <PrimaryPanelCard panel={primary} role={config.id} />
            </div>
            <div className="space-y-4">
              {home.side.map((card) => (
                <SideCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
