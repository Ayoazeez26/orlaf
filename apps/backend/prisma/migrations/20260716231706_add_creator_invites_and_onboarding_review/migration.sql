-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "onboarding_review_note" TEXT,
ADD COLUMN     "onboarding_reviewed_at" TIMESTAMP(3),
ADD COLUMN     "onboarding_reviewed_by_id" TEXT;

-- CreateTable
CREATE TABLE "creator_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_normalized" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "note" TEXT,
    "token" TEXT NOT NULL,
    "status" "invite_status" NOT NULL DEFAULT 'sent',
    "invited_by_id" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creator_invites_token_key" ON "creator_invites"("token");

-- CreateIndex
CREATE INDEX "creator_invites_email_normalized_idx" ON "creator_invites"("email_normalized");

-- AddForeignKey
ALTER TABLE "creator_invites" ADD CONSTRAINT "creator_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
