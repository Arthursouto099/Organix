-- AlterTable
ALTER TABLE "ProjectAssignment" ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "ProjectAssignment" ADD CONSTRAINT "ProjectAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
