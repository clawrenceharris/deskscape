"use server";
import { makeUpdateNotebookUseCase } from "@/composition/notebook";
import { UpdateNotebookInput } from "@/features/notebook/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ActionResultWithData } from "..";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";

export async function updateNotebookAction(input: UpdateNotebookInput): Promise<ActionResultWithData<NotebookForDetail>> {
    try {
        const useCase = await makeUpdateNotebookUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false, error: result.error.message };
        }
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: getUserErrorMessage(error) };
    }
}