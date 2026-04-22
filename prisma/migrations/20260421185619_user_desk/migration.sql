/*
  Warnings:

  - A unique constraint covering the columns `[schoolId,deskId]` on the table `SchoolDesk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "UserDesk" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deskId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDesk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDesk_userId_key" ON "UserDesk"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDesk_deskId_key" ON "UserDesk"("deskId");

-- CreateIndex
CREATE INDEX "UserDesk_userId_idx" ON "UserDesk"("userId");

-- CreateIndex
CREATE INDEX "UserDesk_deskId_idx" ON "UserDesk"("deskId");

-- CreateIndex
CREATE UNIQUE INDEX "UserDesk_userId_deskId_key" ON "UserDesk"("userId", "deskId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolDesk_schoolId_deskId_key" ON "SchoolDesk"("schoolId", "deskId");

-- AddForeignKey
ALTER TABLE "UserDesk" ADD CONSTRAINT "UserDesk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDesk" ADD CONSTRAINT "UserDesk_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
