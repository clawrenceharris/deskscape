-- DropForeignKey
ALTER TABLE "Desk" DROP CONSTRAINT "Desk_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Desk" DROP CONSTRAINT "Desk_schoolId_fkey";

-- AlterTable
ALTER TABLE "Desk" ALTER COLUMN "creatorId" SET DEFAULT 'system',
ALTER COLUMN "schoolId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Desk" ADD CONSTRAINT "Desk_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desk" ADD CONSTRAINT "Desk_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("userId") ON DELETE SET DEFAULT ON UPDATE CASCADE;
