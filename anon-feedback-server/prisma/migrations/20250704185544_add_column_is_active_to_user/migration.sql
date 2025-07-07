-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
