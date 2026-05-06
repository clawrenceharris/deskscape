"use server";
import { ActionResultWithData } from "@/actions";
import { prisma } from "@/lib/db/prisma";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";

export async function getNotebookById(id: string): Promise<ActionResultWithData<NotebookForDetail | null>> {
    try{   
        const notebookRepository = new PrismaNotebookRepository(prisma);
        const item = await notebookRepository.getById(id);
        return { success: true, data: item };
    } catch (error) {
        return { success: false, error: getUserErrorMessage(error) };
    }
}