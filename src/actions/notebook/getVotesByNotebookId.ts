"use server";

import { makeGetVotesByNotebookUseCase } from "@/composition/notebook";
import {  ActionResultWithData } from "@/actions";
import { NotebookVote } from "@/features/notebook/infrastructure/queries";

export async function getVotesByNotebookId(notebookId: string): Promise<ActionResultWithData<NotebookVote[]>> {
    const useCase = await makeGetVotesByNotebookUseCase();
    const result = await useCase.execute(notebookId);
    return result;
    
}