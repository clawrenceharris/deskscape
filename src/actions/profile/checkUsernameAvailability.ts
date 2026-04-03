"use server";
import { makeCheckUsernameAvailabilityUseCase } from "@/composition/profile";

export async function checkUsernameAvailability(username: string) {
   try{
    const checkUsernameAvailabilityUseCase =  makeCheckUsernameAvailabilityUseCase();
    await checkUsernameAvailabilityUseCase.execute(username);
    return {error: null };
   } catch (error) {
    
    return {error };
   }
}