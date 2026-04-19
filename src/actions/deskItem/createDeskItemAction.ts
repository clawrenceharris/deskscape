"use server";
import { CreateDeskItemInput } from "@/features/deskItem/application/dto";
import { ActionResultWithData } from "../index";
import { makeCreateDeskItemUseCase } from "@/composition/deskItem";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";


export async function createDeskItemAction(input: CreateDeskItemInput): Promise<ActionResultWithData<DeskItemForDetail>> {
    try {
        const useCase = await makeCreateDeskItemUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false as const, error: result.error };
        }
        return { success: true as const, data: result.deskItem };
    } catch (error) {
        console.log("error", error);
        return { success: false as const, error: getUserErrorMessage(error) };
    }
    
}