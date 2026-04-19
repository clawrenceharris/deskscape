-- DropForeignKey
ALTER TABLE "Desk" DROP CONSTRAINT "Desk_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "DeskItem" DROP CONSTRAINT "DeskItem_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_profileId_fkey";

-- AddForeignKey
ALTER TABLE "Desk" ADD CONSTRAINT "Desk_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeskItem" ADD CONSTRAINT "DeskItem_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
