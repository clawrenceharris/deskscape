"use server";
import { prisma } from "@/lib/db/prisma";
import { GetNotebooksUseCase } from "../application/use-cases";
import { PrismaNotebookRepository } from "../infrastructure/repositories";
import { GetNotebooksInput } from "../application/dto";
import { ActionResultWithData } from "@/actions";
import { NotebookForDetail } from "../infrastructure/queries";

export async function getNotebooks(input?: GetNotebooksInput): Promise<ActionResultWithData<NotebookForDetail[]>> {
    const repository = new PrismaNotebookRepository(prisma);
    const useCase = new GetNotebooksUseCase(repository);  
    const result = await useCase.execute(input);
    if(!result.success){
        return {success: false, error: result.error.message}
    }
    return result;
}