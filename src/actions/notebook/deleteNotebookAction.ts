"use server";
import { ActionResultWithData } from "../index";
import { getUserErrorMessage } from "@/lib/utils/errors";
import {  makeDeleteNotebookUseCase } from "@/composition/notebook/makeDeleteNotebookUseCase";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";


export async function deleteNotebookAction(id: string): Promise<ActionResultWithData<NotebookForDetail>> {
    try {
        const useCase = makeDeleteNotebookUseCase();
        const result = await useCase.execute(id);
        if(!result.success){
            return { success: false, error: result.error.message };
        }
        return { success: true, data: result.data };
    } catch (error) {
        console.log("error", error);
        return { success: false, error: getUserErrorMessage(error) };
    }
    
}