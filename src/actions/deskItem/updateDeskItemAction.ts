"use server";
import { makeUpdateDeskItemUseCase } from "@/composition/deskItem";
import { UpdateDeskItemInput } from "@/features/deskItem/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ActionResultWithData } from "..";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";

export async function updateDeskItemAction(input: UpdateDeskItemInput): Promise<ActionResultWithData<DeskItemForDetail>> {
    try {
        const useCase = await makeUpdateDeskItemUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false, error: result.error };
        }
        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, error: getUserErrorMessage(error) };
    }
}