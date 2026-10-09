export const CreatorRevenueSplitTier = {
  VERIFIED: "verified",
  TOP: "top",
  EXCLUSIVE: "exclusive",
} as const

export type CreatorRevenueSplitTier =
  (typeof CreatorRevenueSplitTier)[keyof typeof CreatorRevenueSplitTier]

export const CREATOR_REVENUE_SPLIT_TIERS = Object.values(
  CreatorRevenueSplitTier
)

export enum CreatorEarningsEntryType {
  GIFT_CREDIT = "gift_credit",
  UNLOCK_CREDIT = "unlock_credit",
  PAYOUT_DEBIT = "payout_debit",
  ADJUSTMENT = "adjustment",
}

export enum CreatorEarningsDirection {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum PayoutRequestStatus {
  PENDING = "pending",
  SCHEDULED = "scheduled",
  PAID = "paid",
  FAILED = "failed",
  REJECTED = "rejected",
}

export interface CreatorRevenueWallet {
  available_minor: number
  pending_minor: number
  currency: string
  auto_payout_enabled: boolean
  next_auto_payout_at: string | null
  minimum_payout_minor: number
  hold_period_days: number
}

export interface CreatorRevenueActivityItem {
  id: string
  type: CreatorEarningsDirection
  label: string
  amount_minor: number
  created_at: string
}

export interface CreatorRevenueEarningsPoint {
  month: string
  amount_minor: number
}

export interface CreatorPayoutAccount {
  id: string
  bank_name: string
  last4: string
  holder_name: string
  is_primary: boolean
  created_at: string
}

export interface CreatorPayoutHistoryItem {
  id: string
  reference: string
  bank_name: string
  last4: string
  amount_minor: number
  status: PayoutRequestStatus
  created_at: string
  processed_at: string | null
}

export interface CreatorRevenueDashboard {
  wallet: CreatorRevenueWallet
  wallet_activity: CreatorRevenueActivityItem[]
  earnings_over_time: CreatorRevenueEarningsPoint[]
  recent_payouts: CreatorPayoutHistoryItem[]
  bank_accounts: CreatorPayoutAccount[]
  creator_share_percent: number
}

export interface CreateCreatorPayoutAccountRequest {
  bank_name: string
  account_number: string
  holder_name: string
  is_primary?: boolean
}

export interface CreateCreatorPayoutRequestBody {
  amount_minor: number
  payout_account_id?: string
}

export interface CreateCreatorPayoutRequestResponse {
  id: string
  reference: string
  amount_minor: number
  status: PayoutRequestStatus
  created_at: string
}

export interface AdminPayoutListItem {
  id: string
  reference: string
  creator_id: string
  creator_name: string
  creator_email: string
  cycle: string
  amount_minor: number
  method: string
  account_last4: string
  status: PayoutRequestStatus
  date: string
  scheduled_for: string | null
}

export interface AdminPayoutListResponse {
  items: AdminPayoutListItem[]
  total: number
}

export interface AdminPayoutListQuery {
  status?: PayoutRequestStatus | "all"
  creator_id?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface AdminPayoutStats {
  paid_30d_minor: number
  pending_minor: number
  creators_paid_30d: number
  pending_count: number
}

export interface ApproveAdminPayoutRequest {
  scheduled_for: string
  internal_note?: string
}

export interface AdminRevenueSplitTier {
  id: CreatorRevenueSplitTier
  label: string
  creator_percent: number
  platform_percent: number
  affiliate_percent: number
}

export interface AdminRevenueSplitKpi {
  label: string
  value_minor: number
  change_percent?: number
}

export interface AdminRevenueSplitDashboard {
  kpis: AdminRevenueSplitKpi[]
  tiers: AdminRevenueSplitTier[]
  settings: {
    currency: string
    coin_to_minor_units: number
    hold_period_days: number
    minimum_payout_minor: number
    auto_payouts_enabled: boolean
  }
}

export interface UpdateAdminRevenueSplitTierRequest {
  creator_percent: number
  platform_percent: number
  affiliate_percent: number
}

export interface UpdatePlatformPayoutSettingsRequest {
  currency?: string
  holdPeriodDays?: number
  minimumPayoutMinor?: number
  autoPayoutsEnabled?: boolean
}
