/*
  Warnings:

  - You are about to drop the column `profileId` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,deskId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_profileId_fkey";

-- DropIndex
DROP INDEX "Member_profileId_deskId_key";

-- DropIndex
DROP INDEX "Member_profileId_idx";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_deskId_key" ON "Member"("userId", "deskId");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
