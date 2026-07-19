-- AlterTable: Account 2FA fields
ALTER TABLE "accounts"
ADD COLUMN "totp_secret_enc" TEXT,
ADD COLUMN "totp_enabled_at" TIMESTAMP(3);

-- AlterTable: RefreshToken session metadata
ALTER TABLE "refresh_tokens"
ADD COLUMN "session_root_id" TEXT,
ADD COLUMN "surface" TEXT,
ADD COLUMN "browser" TEXT,
ADD COLUMN "os" TEXT,
ADD COLUMN "user_agent" TEXT,
ADD COLUMN "ip_address" TEXT,
ADD COLUMN "location" TEXT;

-- Backfill session_root_id for existing rows
UPDATE "refresh_tokens" SET "session_root_id" = "id" WHERE "session_root_id" IS NULL;

ALTER TABLE "refresh_tokens" ALTER COLUMN "session_root_id" SET NOT NULL;

CREATE INDEX "refresh_tokens_session_root_id_idx" ON "refresh_tokens"("session_root_id");
