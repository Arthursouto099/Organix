/*
  Warnings:

  - Made the column `effectiveness` on table `Feedback5W2H` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Feedback5W2H" ALTER COLUMN "effectiveness" SET NOT NULL,
ALTER COLUMN "effectiveness" SET DEFAULT 'não';
