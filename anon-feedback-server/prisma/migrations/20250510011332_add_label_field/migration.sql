-- CreateEnum
CREATE TYPE "PriorityStatus" AS ENUM ('CRITICA', 'ALTA', 'NORMAL');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "priority" "PriorityStatus" NOT NULL DEFAULT 'NORMAL';
