"use server";
import { makeGetProfileUseCase } from "@/composition/profile";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { ActionResultWithData } from "@/actions";

export async function getProfile(userId: string): Promise<ActionResultWithData<ProfileForDetail | null>> {
    const useCase = await makeGetProfileUseCase();
    const result = await useCase.execute(userId);
    if(!result.success){
      return { success: false as const, error: result.error.message };

    }
    return result;
 
}