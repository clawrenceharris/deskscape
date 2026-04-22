"use server"
import { joinOrLeaveDeskUseCase } from "@/composition/desk";
import { ActionResult } from "..";
import { JoinOrLeaveDeskInput } from "@/features/desk/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function joinOrLeaveDeskAction(input: JoinOrLeaveDeskInput): Promise<ActionResult> {
    try {
        const useCase = joinOrLeaveDeskUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false as const, error: result.error.message };
        }
        return result;
    } catch (error) {
        return { success: false as const, error: getUserErrorMessage(error) };
    }
}