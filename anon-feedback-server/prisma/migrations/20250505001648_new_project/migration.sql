/*
  Warnings:

  - You are about to drop the `Feedback5W2H` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feedback5W2H" DROP CONSTRAINT "Feedback5W2H_idUser_fkey";

-- DropTable
DROP TABLE "Feedback5W2H";

-- DropEnum
DROP TYPE "FeedbackStatus";
