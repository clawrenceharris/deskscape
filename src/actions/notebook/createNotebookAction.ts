"use server";
import { CreateNotebookInput } from "@/features/notebook/application/dto";
import { ActionResultWithData } from "../index";
import { makeCreateNotebookUseCase } from "@/composition/notebook";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";


export async function createNotebookAction(input: CreateNotebookInput): Promise<ActionResultWithData<NotebookForDetail>> {
    try {
        const useCase = await makeCreateNotebookUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false as const, error: result.error.message };
        }
        return result;
    } catch (error) {
        console.log("error", error);
        return { success: false as const, error: getUserErrorMessage(error) };
    }
    
}