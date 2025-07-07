/*
  Warnings:

  - Added the required column `budget` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pogress" INTEGER NOT NULL DEFAULT 0;
