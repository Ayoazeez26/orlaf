-- AlterTable
ALTER TABLE "creator_profiles"
ADD COLUMN "notify_email_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_push_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notify_in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_episode_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_new_comments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_content_flagged" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_payout_processed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_coin_purchases" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "notify_revenue_milestone" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_subscriber_milestone" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_weekly_digest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_series_trending" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_team_member_joined" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notify_permission_changed" BOOLEAN NOT NULL DEFAULT true;
