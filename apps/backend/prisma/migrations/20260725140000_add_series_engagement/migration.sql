-- CreateTable
CREATE TABLE "series_likes" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "series_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "body" TEXT NOT NULL,
    "pinned_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_events" (
    "id" TEXT NOT NULL,
    "series_id" TEXT NOT NULL,
    "account_id" TEXT,
    "channel" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "series_likes_series_id_idx" ON "series_likes"("series_id");

-- CreateIndex
CREATE INDEX "series_likes_account_id_created_at_idx" ON "series_likes"("account_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "series_likes_account_id_series_id_key" ON "series_likes"("account_id", "series_id");

-- CreateIndex
CREATE INDEX "comments_series_id_parent_id_created_at_idx" ON "comments"("series_id", "parent_id", "created_at");

-- CreateIndex
CREATE INDEX "comments_account_id_idx" ON "comments"("account_id");

-- CreateIndex
CREATE INDEX "comment_likes_comment_id_idx" ON "comment_likes"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_account_id_comment_id_key" ON "comment_likes"("account_id", "comment_id");

-- CreateIndex
CREATE INDEX "share_events_series_id_created_at_idx" ON "share_events"("series_id", "created_at");

-- CreateIndex
CREATE INDEX "share_events_channel_idx" ON "share_events"("channel");

-- AddForeignKey
ALTER TABLE "series_likes" ADD CONSTRAINT "series_likes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_likes" ADD CONSTRAINT "series_likes_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_events" ADD CONSTRAINT "share_events_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "share_events" ADD CONSTRAINT "share_events_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
