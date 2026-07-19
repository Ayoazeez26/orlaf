-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series_genres" (
    "series_id" TEXT NOT NULL,
    "genre_id" TEXT NOT NULL,

    CONSTRAINT "series_genres_pkey" PRIMARY KEY ("series_id","genre_id")
);

-- Seed canonical genres (matches SERIES_GENRES in @sable/contracts)
INSERT INTO "genres" ("id", "name", "slug", "sort_order", "updated_at") VALUES
  ('genre_drama', 'Drama', 'drama', 1, CURRENT_TIMESTAMP),
  ('genre_romance', 'Romance', 'romance', 2, CURRENT_TIMESTAMP),
  ('genre_comedy', 'Comedy', 'comedy', 3, CURRENT_TIMESTAMP),
  ('genre_thriller', 'Thriller', 'thriller', 4, CURRENT_TIMESTAMP),
  ('genre_documentary', 'Documentary', 'documentary', 5, CURRENT_TIMESTAMP),
  ('genre_anthology', 'Anthology', 'anthology', 6, CURRENT_TIMESTAMP),
  ('genre_sci_fi', 'Sci-Fi', 'sci-fi', 7, CURRENT_TIMESTAMP),
  ('genre_horror', 'Horror', 'horror', 8, CURRENT_TIMESTAMP),
  ('genre_music', 'Music', 'music', 9, CURRENT_TIMESTAMP),
  ('genre_action', 'Action', 'action', 10, CURRENT_TIMESTAMP);

-- Backfill junction table from legacy series.genres text arrays
INSERT INTO "series_genres" ("series_id", "genre_id")
SELECT DISTINCT s.id, g.id
FROM "series" s
CROSS JOIN LATERAL unnest(s.genres) AS genre_name(name)
INNER JOIN "genres" g ON g.name = genre_name.name;

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_slug_key" ON "genres"("slug");

-- CreateIndex
CREATE INDEX "series_genres_genre_id_idx" ON "series_genres"("genre_id");

-- AddForeignKey
ALTER TABLE "series_genres" ADD CONSTRAINT "series_genres_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_genres" ADD CONSTRAINT "series_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropColumn
ALTER TABLE "series" DROP COLUMN "genres";
