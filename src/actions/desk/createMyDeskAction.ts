"use server";
import { makeCreateMyDeskUseCase } from "@/composition/desk";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ActionResultWithData } from "..";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";

export async function createMyDeskAction(profileId: string): Promise<ActionResultWithData<DeskForDetail>> {
    try {
        const useCase = makeCreateMyDeskUseCase();
        const result = await useCase.execute(profileId);
        if(!result.success){
            return { success: false as const, error: result.error.message };
        }
        return result;
    } catch (error) {
        return { success: false as const, error: getUserErrorMessage(error) };
    }
}