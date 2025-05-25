-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateTable
CREATE TABLE "Feedback5W2H" (
    "id" TEXT NOT NULL,
    "whatToDo" TEXT NOT NULL,
    "whyToDo" TEXT NOT NULL,
    "whoWillDo" TEXT NOT NULL,
    "whereProcessImpacted" TEXT NOT NULL,
    "howToDo" TEXT NOT NULL,
    "neededResources" TEXT[],
    "deadline" TIMESTAMP(3),
    "status" "FeedbackStatus" NOT NULL DEFAULT 'pending',
    "implementation" TEXT NOT NULL DEFAULT 'sim',
    "effectiveness" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "Feedback5W2H_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback5W2H" ADD CONSTRAINT "Feedback5W2H_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
