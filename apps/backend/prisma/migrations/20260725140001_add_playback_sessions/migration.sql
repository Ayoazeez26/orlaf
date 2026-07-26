-- CreateTable
CREATE TABLE "playback_sessions" (
    "id" TEXT NOT NULL,
    "episode_id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "account_id" TEXT,
    "anon_id" TEXT,
    "device_type" TEXT NOT NULL,
    "platform" TEXT,
    "app_version" TEXT,
    "source" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_heartbeat_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "watched_seconds" INTEGER NOT NULL DEFAULT 0,
    "max_position_seconds" INTEGER NOT NULL DEFAULT 0,
    "duration_seconds" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "counted_as_view" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "playback_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playback_sessions_creator_id_started_at_idx" ON "playback_sessions"("creator_id", "started_at");

-- CreateIndex
CREATE INDEX "playback_sessions_episode_id_started_at_idx" ON "playback_sessions"("episode_id", "started_at");

-- CreateIndex
CREATE INDEX "playback_sessions_series_id_started_at_idx" ON "playback_sessions"("series_id", "started_at");

-- CreateIndex
CREATE INDEX "playback_sessions_account_id_started_at_idx" ON "playback_sessions"("account_id", "started_at");

-- CreateIndex
CREATE INDEX "playback_sessions_anon_id_started_at_idx" ON "playback_sessions"("anon_id", "started_at");

-- AddForeignKey
ALTER TABLE "playback_sessions" ADD CONSTRAINT "playback_sessions_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_sessions" ADD CONSTRAINT "playback_sessions_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_sessions" ADD CONSTRAINT "playback_sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
