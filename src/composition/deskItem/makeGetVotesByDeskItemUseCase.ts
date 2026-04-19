import { GetVotesByDeskItemUseCase } from "@/features/deskItem/application/use-cases";
import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export async function makeGetVotesByDeskItemUseCase() {
    const repository = new PrismaDeskItemRepository(prisma);
    const useCase = new GetVotesByDeskItemUseCase(repository);
    return useCase;
}