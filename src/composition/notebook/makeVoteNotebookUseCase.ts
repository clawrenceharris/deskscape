import { VoteNotebookUseCase } from "@/features/notebook/application/use-cases";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export async function makeVoteNotebookUseCase() {
    const repository = new PrismaNotebookRepository(prisma);
    const useCase = new VoteNotebookUseCase(repository);
    return useCase;
}