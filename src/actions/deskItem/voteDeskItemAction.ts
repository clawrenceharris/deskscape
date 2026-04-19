"use server";
import { makeVoteDeskItemUseCase } from "@/composition/deskItem";
import { ActionResult } from "../index";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { VoteDeskItemInput } from "@/features/deskItem/application/dto";
export async function voteDeskItemAction(input: VoteDeskItemInput): Promise<ActionResult> {
    try {
        const useCase = await makeVoteDeskItemUseCase();
        const result = await useCase.execute(input);
        return result;
    } 
    catch (error) {
        console.error("Error voting desk item", error);
        return { success: false, error: getUserErrorMessage(error) };
    }
}