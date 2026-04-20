/*
  Warnings:

  - The primary key for the `Download` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deskItemId` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `deskItemId` on the `Material` table. All the data in the column will be lost.
  - The primary key for the `Vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deskItemId` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the `DeskItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notebookId` to the `Download` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notebookId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notebookId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeskItem" DROP CONSTRAINT "DeskItem_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "DeskItem" DROP CONSTRAINT "DeskItem_deskId_fkey";

-- DropForeignKey
ALTER TABLE "Download" DROP CONSTRAINT "Download_deskItemId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_deskItemId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_deskItemId_fkey";

-- DropIndex
DROP INDEX "Material_deskItemId_idx";

-- DropIndex
DROP INDEX "Vote_deskItemId_idx";

-- AlterTable
ALTER TABLE "Download" DROP CONSTRAINT "Download_pkey",
DROP COLUMN "deskItemId",
ADD COLUMN     "notebookId" TEXT NOT NULL,
ADD CONSTRAINT "Download_pkey" PRIMARY KEY ("userId", "notebookId");

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "deskItemId",
ADD COLUMN     "notebookId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pkey",
DROP COLUMN "deskItemId",
ADD COLUMN     "notebookId" TEXT NOT NULL,
ADD CONSTRAINT "Vote_pkey" PRIMARY KEY ("userId", "notebookId");

-- DropTable
DROP TABLE "DeskItem";

-- CreateTable
CREATE TABLE "Notebook" (
    "id" TEXT NOT NULL,
    "deskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notebook_creatorId_idx" ON "Notebook"("creatorId");

-- CreateIndex
CREATE INDEX "Notebook_deskId_idx" ON "Notebook"("deskId");

-- CreateIndex
CREATE INDEX "Notebook_created_at_idx" ON "Notebook"("created_at");

-- CreateIndex
CREATE INDEX "Notebook_updated_at_idx" ON "Notebook"("updated_at");

-- CreateIndex
CREATE INDEX "Download_notebookId_idx" ON "Download"("notebookId");

-- CreateIndex
CREATE INDEX "Material_notebookId_idx" ON "Material"("notebookId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
