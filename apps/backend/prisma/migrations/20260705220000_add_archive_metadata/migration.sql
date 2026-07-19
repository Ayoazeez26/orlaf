-- AlterTable
ALTER TABLE "series" ADD COLUMN "archived_at" TIMESTAMP(3),
ADD COLUMN "status_before_archive" "series_status";

-- AlterTable
ALTER TABLE "episodes" ADD COLUMN "archived_at" TIMESTAMP(3);
