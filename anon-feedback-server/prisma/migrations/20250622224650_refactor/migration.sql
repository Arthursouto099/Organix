-- DropForeignKey
ALTER TABLE "ProjectAssignment" DROP CONSTRAINT "ProjectAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectAssignment" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
