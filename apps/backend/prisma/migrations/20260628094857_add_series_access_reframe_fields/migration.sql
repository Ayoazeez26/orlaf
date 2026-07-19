-- AlterTable
ALTER TABLE "series" ADD COLUMN     "auto_reframe_to_916" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "default_access_type" "access_type" NOT NULL DEFAULT 'free';
