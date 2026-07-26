-- CreateEnum
CREATE TYPE "download_status" AS ENUM ('queued', 'downloading', 'ready', 'failed');

-- CreateEnum
CREATE TYPE "download_quality" AS ENUM ('standard', 'high', 'full_hd');

-- CreateTable
CREATE TABLE "download_entries" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "episode_id" TEXT NOT NULL,
    "quality" "download_quality" NOT NULL DEFAULT 'full_hd',
    "status" "download_status" NOT NULL DEFAULT 'queued',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "estimated_bytes" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "download_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "download_entries_account_id_created_at_idx" ON "download_entries"("account_id", "created_at");

-- CreateIndex
CREATE INDEX "download_entries_series_id_idx" ON "download_entries"("series_id");

-- CreateIndex
CREATE UNIQUE INDEX "download_entries_account_id_episode_id_quality_key" ON "download_entries"("account_id", "episode_id", "quality");

-- AddForeignKey
ALTER TABLE "download_entries" ADD CONSTRAINT "download_entries_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "download_entries" ADD CONSTRAINT "download_entries_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "download_entries" ADD CONSTRAINT "download_entries_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
