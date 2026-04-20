"use server";

import { makeDownloadNotebookUseCase } from "@/composition/notebook";
import { ActionResult } from "..";
import { DownloadNotebookInput } from "@/features/notebook/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function downloadNotebookAction(input: DownloadNotebookInput):Promise<ActionResult> {
  try{
    const useCase = await makeDownloadNotebookUseCase();
    const result = await useCase.execute(input);
    if(!result.success){
      return { success: false as const, error: result.error.message}
    }
    return result;
  }
  catch(error){
    return { success: false as const, error: getUserErrorMessage(error) }
  }
}