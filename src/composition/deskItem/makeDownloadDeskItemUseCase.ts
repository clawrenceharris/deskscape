import { prisma } from "@/lib/db/prisma";
import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories";
import { DownloadDeskItemUseCase } from "@/features/deskItem/application/use-cases";

export async function makeDownloadDeskItemUseCase() {
  const repository = new PrismaDeskItemRepository(prisma);
  return new DownloadDeskItemUseCase(repository);
}