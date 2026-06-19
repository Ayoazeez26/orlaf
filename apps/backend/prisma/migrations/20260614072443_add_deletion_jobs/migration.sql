/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "deletion_jobs" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "run_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deletion_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deletion_jobs_account_id_key" ON "deletion_jobs"("account_id");

-- CreateIndex
CREATE INDEX "deletion_jobs_run_at_idx" ON "deletion_jobs"("run_at");

-- AddForeignKey
ALTER TABLE "deletion_jobs" ADD CONSTRAINT "deletion_jobs_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
