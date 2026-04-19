-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "schoolId" TEXT;

-- CreateIndex
CREATE INDEX "Profile_schoolId_idx" ON "Profile"("schoolId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
