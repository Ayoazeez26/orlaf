-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('user', 'creator', 'admin');

-- CreateEnum
CREATE TYPE "account_status" AS ENUM ('active', 'pending_deletion', 'deleted', 'onboarding', 'pending_approval', 'suspended', 'rejected');

-- CreateEnum
CREATE TYPE "oauth_provider" AS ENUM ('google', 'apple');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "account_type" "account_type" NOT NULL,
    "email" TEXT NOT NULL,
    "email_normalized" TEXT NOT NULL,
    "provider" "oauth_provider",
    "provider_subject_id" TEXT,
    "password_hash" TEXT,
    "must_change_password" BOOLEAN NOT NULL DEFAULT false,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "status" "account_status" NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "anonymized_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_email_idx" ON "accounts"("email");

-- CreateIndex
CREATE INDEX "accounts_account_type_status_idx" ON "accounts"("account_type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_type_email_normalized_key" ON "accounts"("account_type", "email_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_type_provider_provider_subject_id_key" ON "accounts"("account_type", "provider", "provider_subject_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
