-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "profileId" TEXT,
    "deskItemId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Download_profileId_idx" ON "Download"("profileId");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_deskItemId_fkey" FOREIGN KEY ("deskItemId") REFERENCES "DeskItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
