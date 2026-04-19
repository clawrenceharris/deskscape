"use server";
import { makeCheckUsernameAvailabilityUseCase } from "@/composition/profile";
import { ActionResultWithData } from "..";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function checkUsernameAvailability(username: string, userId: string): Promise<ActionResultWithData<{isAvailable: boolean}>> {
   try{
      const checkUsernameAvailabilityUseCase =  makeCheckUsernameAvailabilityUseCase();
      const result = await checkUsernameAvailabilityUseCase.execute(username, userId);
      if(result.success) {
         return {success: true, data: {isAvailable: result.isAvailable } };
      }

      return {success: false, error: result.error };
   } catch (error) {
    
    return {success: false, error: getUserErrorMessage(error) };
   }
}