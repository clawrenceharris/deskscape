"use server"
import { ActionResultWithData } from "..";
import { CreateProfileInput } from "@/features/profile/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { makeCreateProfileUseCase } from "@/composition/profile";



export async function createProfileAction(input: CreateProfileInput): Promise<ActionResultWithData<ProfileForDetail>> {
   
    try {  
        const useCase = await makeCreateProfileUseCase();
        const result = await useCase.execute(input);
        if(!result.success){
            return { success: false as const, error: result.error.message };
        }
        return result

    } catch (error) {  
      return { success: false as const, error: getUserErrorMessage(error) };
    }
}