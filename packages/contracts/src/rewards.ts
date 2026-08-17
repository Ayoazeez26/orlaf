/** Rewards, streaks, and referral program */

export interface RewardsSummaryResponse {
  current_streak: number
  longest_streak: number
  can_check_in: boolean
  next_check_in_coins: number
  total_coins_earned: number
  referral_code: string
  referral_redemptions: number
  referral_coins_earned: number
}

export interface CheckInResponse {
  coins_awarded: number
  current_streak: number
  balance: number
}

export interface RedeemReferralRequest {
  code: string
}

export interface RedeemReferralResponse {
  coins_awarded: number
  balance: number
}

export const REFERRAL_BONUS_COINS = 100
export const REFERRAL_REFERRER_COINS = 100
export const DAILY_CHECK_IN_BASE_COINS = 10
export const DAILY_CHECK_IN_STREAK_BONUS = 5
export const DAILY_CHECK_IN_MAX_COINS = 100
