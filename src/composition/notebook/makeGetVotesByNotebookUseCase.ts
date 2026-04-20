import { GetVotesByNotebookUseCase } from "@/features/notebook/application/use-cases";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export async function makeGetVotesByNotebookUseCase() {
    const repository = new PrismaNotebookRepository(prisma);
    const useCase = new GetVotesByNotebookUseCase(repository);
    return useCase;
}