import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { DeleteNotebookUseCase } from "@/features/notebook/application/use-cases";
import { prisma } from "@/lib/db/prisma";

export function makeDeleteNotebookUseCase() {
    const repository = new PrismaNotebookRepository(prisma);
    return new DeleteNotebookUseCase(repository);
}