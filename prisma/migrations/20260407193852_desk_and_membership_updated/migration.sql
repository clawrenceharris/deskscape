/*
  Warnings:

  - The values [DISCUSSION,TEST,FLASHCARDS,LECTURE] on the enum `MaterialType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('VIEWER', 'CONTRIBUTOR', 'OWNER');

-- AlterEnum
BEGIN;
CREATE TYPE "MaterialType_new" AS ENUM ('NOTES', 'WORKSHEET', 'QUIZ', 'STUDY_GUIDE', 'OTHER');
ALTER TABLE "Material" ALTER COLUMN "type" TYPE "MaterialType_new" USING ("type"::text::"MaterialType_new");
ALTER TYPE "MaterialType" RENAME TO "MaterialType_old";
ALTER TYPE "MaterialType_new" RENAME TO "MaterialType";
DROP TYPE "public"."MaterialType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Desk" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "DeskItem" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'VIEWER';
