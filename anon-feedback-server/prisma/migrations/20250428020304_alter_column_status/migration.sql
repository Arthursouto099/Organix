/*
  Warnings:

  - The values [pending,in_progress,completed] on the enum `FeedbackStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedbackStatus_new" AS ENUM ('pendente', 'em_progresso', 'completo');
ALTER TABLE "Feedback5W2H" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Feedback5W2H" ALTER COLUMN "status" TYPE "FeedbackStatus_new" USING ("status"::text::"FeedbackStatus_new");
ALTER TYPE "FeedbackStatus" RENAME TO "FeedbackStatus_old";
ALTER TYPE "FeedbackStatus_new" RENAME TO "FeedbackStatus";
DROP TYPE "FeedbackStatus_old";
ALTER TABLE "Feedback5W2H" ALTER COLUMN "status" SET DEFAULT 'pendente';
COMMIT;

-- AlterTable
ALTER TABLE "Feedback5W2H" ALTER COLUMN "status" SET DEFAULT 'pendente';
