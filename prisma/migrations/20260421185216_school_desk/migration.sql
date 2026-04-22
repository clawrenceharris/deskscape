-- AlterTable
ALTER TABLE "School" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "schoolDeskId" TEXT;

-- CreateTable
CREATE TABLE "SchoolDesk" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "deskId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolDesk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SchoolDesk_schoolId_key" ON "SchoolDesk"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolDesk_deskId_key" ON "SchoolDesk"("deskId");

-- CreateIndex
CREATE INDEX "SchoolDesk_schoolId_idx" ON "SchoolDesk"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolDesk_deskId_idx" ON "SchoolDesk"("deskId");

-- AddForeignKey
ALTER TABLE "SchoolDesk" ADD CONSTRAINT "SchoolDesk_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDesk" ADD CONSTRAINT "SchoolDesk_deskId_fkey" FOREIGN KEY ("deskId") REFERENCES "Desk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
