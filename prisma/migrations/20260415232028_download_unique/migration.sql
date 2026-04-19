/*
  Warnings:

  - You are about to drop the column `profileId` on the `Download` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Download` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_profileId_fkey";

-- DropIndex
DROP INDEX "Download_profileId_idx";

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Download_userId_key" ON "Download"("userId");

-- CreateIndex
CREATE INDEX "Download_userId_idx" ON "Download"("userId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
