"use server";
import { prisma } from "@/lib/db/prisma";
import { GetNotebooksUseCase } from "@/features/notebook/application/use-cases";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { GetNotebooksInput } from "@/features/notebook/application/dto";
import { ActionResultWithData } from "@/actions";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";

export async function getNotebooks(input?: GetNotebooksInput): Promise<ActionResultWithData<NotebookForDetail[]>> {
    const repository = new PrismaNotebookRepository(prisma);
    const useCase = new GetNotebooksUseCase(repository);  
    const result = await useCase.execute(input);
    if(!result.success){
        return {success: false, error: result.error.message}
    }
    return result;
}