"use server"
import { makeCreateOrUpdateProfileUseCase } from "@/composition/profile";
import { ActionResultWithData } from "..";
import { CreateOrUpdateProfileInput } from "@/features/profile/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";



export async function createOrUpdateProfileAction(input: CreateOrUpdateProfileInput): Promise<ActionResultWithData<ProfileForDetail>> {
   
    try {
        
      const createProfileUseCase = await makeCreateOrUpdateProfileUseCase();
      const result = await createProfileUseCase.execute(input);
      if(!result.success){
        return { success: false as const, error: result.error };
      }
        return { success: true as const, data: result.profile };

    } catch (error) {  
      return { success: false as const, error: getUserErrorMessage(error) };
    }
}