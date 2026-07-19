-- AlterTable
ALTER TABLE "creator_profiles"
ADD COLUMN "default_content_language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN "default_visibility" TEXT NOT NULL DEFAULT 'public',
ADD COLUMN "comments_enabled_by_default" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "auto_publish_after_processing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "tipping_enabled_by_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "dashboard_language" TEXT NOT NULL DEFAULT 'English',
ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos',
ADD COLUMN "color_scheme" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN "reduced_motion" BOOLEAN NOT NULL DEFAULT false;
