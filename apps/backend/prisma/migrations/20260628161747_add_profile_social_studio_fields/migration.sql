/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `creator_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "instagram_url" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tiktok_url" TEXT,
ADD COLUMN     "twitter_url" TEXT,
ADD COLUMN     "youtube_url" TEXT;

-- AlterTable
ALTER TABLE "creator_profiles" ADD COLUMN     "description" TEXT,
ADD COLUMN     "handle" TEXT,
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free';

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_handle_key" ON "creator_profiles"("handle");
