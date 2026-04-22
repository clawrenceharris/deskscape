"use server"
import { ActionResultWithData } from "..";
import { UpdateProfileInput } from "@/features/profile/application/dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { makeUpdateProfileUseCase } from "@/composition/profile";

export async function updateProfileAction(input: UpdateProfileInput): Promise<ActionResultWithData<ProfileForDetail>> {

    try {   
      const useCase = await makeUpdateProfileUseCase();
      const result = await useCase.execute(input);
      if(!result.success){
        return { success: false as const, error: result.error.message };
      }
      return result;

    } catch (error) {  
      return { success: false as const, error: getUserErrorMessage(error) };
    }
}