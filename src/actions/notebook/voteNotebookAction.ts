"use server";
import { makeVoteNotebookUseCase } from "@/composition/notebook";
import { ActionResult } from "../index";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { VoteNotebookInput } from "@/features/notebook/application/dto";
export async function voteNotebookAction(input: VoteNotebookInput): Promise<ActionResult> {
    try {
        const useCase = await makeVoteNotebookUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false as const, error: result.error.message }
        }
        return result;
    } 
    catch (error) {
        console.error("Error voting notebook", error);
        return { success: false, error: getUserErrorMessage(error) };
    }
}