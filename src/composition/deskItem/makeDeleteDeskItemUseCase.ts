import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories";
import { DeleteDeskItemUseCase } from "@/features/deskItem/application/use-cases";
import { prisma } from "@/lib/db/prisma";

export function makeDeleteDeskItemUseCase() {
    const repository = new PrismaDeskItemRepository(prisma);
    return new DeleteDeskItemUseCase(repository);
}