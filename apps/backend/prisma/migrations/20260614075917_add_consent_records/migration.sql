-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "needs_consent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "policy_versions" JSONB NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_ip" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consent_records_account_id_idx" ON "consent_records"("account_id");

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
