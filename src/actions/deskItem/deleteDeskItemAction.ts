"use server";
import { ActionResultWithData } from "../index";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { makeDeleteDeskItemUseCase } from "@/composition/deskItem/makeDeleteDeskItemUseCase";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";


export async function deleteDeskItemAction(id: string): Promise<ActionResultWithData<DeskItemForDetail>> {
    try {
        const useCase = makeDeleteDeskItemUseCase();
        const result = await useCase.execute(id);
        if(!result.success){
            return { success: false, error: result.error };
        }
        return { success: true, data: result.data };
    } catch (error) {
        console.log("error", error);
        return { success: false, error: getUserErrorMessage(error) };
    }
    
}