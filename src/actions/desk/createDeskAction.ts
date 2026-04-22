"use server";
import { makeCreateDeskUseCase } from "@/composition/desk";
import { ActionResultWithData } from "../index";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { CreateDeskInput } from "@/features/desk/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

/**
 * Creates a new desk
 * @param userId - The ID of the user creating the desk
 * @param data - The form values for creating a desk
 * @returns {ActionResultWithData} - The result of the create desk action
 */
export async function createDeskAction(input: CreateDeskInput): Promise<ActionResultWithData<DeskForDetail>> {
    try {
      const useCase = await makeCreateDeskUseCase();
      const result = await useCase.execute(input);
      if(!result.success){
        return { success: false as const, error: result.error.message };
      }
      return result

    } catch (error) {            
      return { success: false as const, error: getUserErrorMessage(error) };
    }
}
 
 