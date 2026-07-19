-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('super_admin', 'content_admin', 'marketing_admin', 'finance_admin', 'support_admin');

-- CreateEnum
CREATE TYPE "invite_status" AS ENUM ('sent', 'accepted', 'expired', 'revoked');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN "admin_role" "admin_role";

-- CreateTable
CREATE TABLE "admin_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_normalized" TEXT NOT NULL,
    "role" "admin_role" NOT NULL,
    "token" TEXT NOT NULL,
    "status" "invite_status" NOT NULL DEFAULT 'sent',
    "invited_by_id" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_invites_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "series" ADD COLUMN "admin_action_by_id" TEXT,
ADD COLUMN "admin_action_at" TIMESTAMP(3),
ADD COLUMN "admin_action_note" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "admin_invites_token_key" ON "admin_invites"("token");

-- CreateIndex
CREATE INDEX "admin_invites_email_normalized_idx" ON "admin_invites"("email_normalized");

-- AddForeignKey
ALTER TABLE "admin_invites" ADD CONSTRAINT "admin_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_admin_action_by_id_fkey" FOREIGN KEY ("admin_action_by_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
