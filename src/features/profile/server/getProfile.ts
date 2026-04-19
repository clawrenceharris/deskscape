"use server";
import { makeGetProfileUseCase } from "@/composition/profile";
import { GetUserProfileResult } from "../application/dto";

export async function getProfile(userId: string): Promise<GetUserProfileResult> {
    const useCase = await makeGetProfileUseCase();
    const result = await useCase.execute(userId);
    if(!result.success){
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
 
}