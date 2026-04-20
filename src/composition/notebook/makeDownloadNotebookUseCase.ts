import { prisma } from "@/lib/db/prisma";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { DownloadNotebookUseCase } from "@/features/notebook/application/use-cases";

export async function makeDownloadNotebookUseCase() {
  const repository = new PrismaNotebookRepository(prisma);
  return new DownloadNotebookUseCase(repository);
}