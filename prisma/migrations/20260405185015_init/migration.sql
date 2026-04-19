/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('NOTES', 'DISCUSSION', 'WORKSHEET', 'QUIZ', 'STUDY_GUIDE', 'TEST', 'FLASHCARDS', 'LECTURE', 'OTHER');

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_deskItemId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "deskItemId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MaterialType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Material_deskItemId_idx" ON "Material"("deskItemId");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_deskItemId_fkey" FOREIGN KEY ("deskItemId") REFERENCES "DeskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
