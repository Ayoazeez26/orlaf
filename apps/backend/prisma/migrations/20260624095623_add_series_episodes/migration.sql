-- CreateEnum
CREATE TYPE "series_type" AS ENUM ('short_series', 'short_film');

-- CreateEnum
CREATE TYPE "series_status" AS ENUM ('draft', 'in_review', 'published', 'rejected', 'archived');

-- CreateEnum
CREATE TYPE "access_type" AS ENUM ('free', 'coin_gated', 'premium');

-- CreateEnum
CREATE TYPE "episode_status" AS ENUM ('pending', 'uploading', 'processing', 'ready', 'failed');

-- CreateTable
CREATE TABLE "series" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "type" "series_type" NOT NULL DEFAULT 'short_series',
    "status" "series_status" NOT NULL DEFAULT 'draft',
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "language" TEXT NOT NULL DEFAULT 'English',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subtitle_languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "poster_url" TEXT,
    "trailer_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "listed_in_search" BOOLEAN NOT NULL DEFAULT true,
    "comments_enabled" BOOLEAN NOT NULL DEFAULT true,
    "tipping_enabled" BOOLEAN NOT NULL DEFAULT false,
    "cast" JSONB NOT NULL DEFAULT '[]',
    "crew" JSONB NOT NULL DEFAULT '[]',
    "ai_vertical_conversion" BOOLEAN NOT NULL DEFAULT true,
    "auto_captions" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episodes" (
    "id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "video_hosting_id" TEXT,
    "hls_url" TEXT,
    "dash_url" TEXT,
    "thumbnail_url" TEXT,
    "preview_url" TEXT,
    "duration_seconds" DOUBLE PRECISION,
    "file_size_bytes" BIGINT,
    "width" INTEGER,
    "height" INTEGER,
    "status" "episode_status" NOT NULL DEFAULT 'pending',
    "access_type" "access_type" NOT NULL DEFAULT 'free',
    "coin_price" INTEGER,
    "subtitle_tracks" JSONB NOT NULL DEFAULT '[]',
    "ai_vertical_conversion" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "series_creator_id_idx" ON "series"("creator_id");

-- CreateIndex
CREATE INDEX "series_status_idx" ON "series"("status");

-- CreateIndex
CREATE INDEX "episodes_series_id_order_idx" ON "episodes"("series_id", "order");

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
