import { VoteDeskItemUseCase } from "@/features/deskItem/application/use-cases";
import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export async function makeVoteDeskItemUseCase() {
    const repository = new PrismaDeskItemRepository(prisma);
    const useCase = new VoteDeskItemUseCase(repository);
    return useCase;
}