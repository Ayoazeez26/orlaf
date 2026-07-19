-- AlterTable
ALTER TABLE "episodes" ADD COLUMN     "auto_caption_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "auto_reframe_to_916" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "season" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subtitle_url" TEXT;
