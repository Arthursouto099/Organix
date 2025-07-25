/*
  Warnings:

  - You are about to drop the column `updatedAT` on the `ProjectAssignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectAssignment" DROP COLUMN "updatedAT",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
