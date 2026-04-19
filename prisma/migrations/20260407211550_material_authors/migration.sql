/*
  Warnings:

  - Added the required column `authorId` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Material_authorId_idx" ON "Material"("authorId");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
