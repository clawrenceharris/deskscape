/*
  Warnings:

  - The primary key for the `Download` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Download` table. All the data in the column will be lost.
  - Made the column `userId` on table `Download` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_userId_fkey";

-- AlterTable
ALTER TABLE "Download" DROP CONSTRAINT "Download_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "Download_pkey" PRIMARY KEY ("userId", "deskItemId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE NO ACTION ON UPDATE CASCADE;
