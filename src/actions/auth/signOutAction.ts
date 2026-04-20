"use server"
import { getUserErrorMessage } from "@/lib/utils/errors";
import { makeSignOutUserUseCase } from "@/composition/auth";
import { ActionResult } from "..";


export async function signOutAction(): Promise<ActionResult> {
    try {

        const useCase = await makeSignOutUserUseCase();
        const result = await useCase.execute();
        if(!result.success){
            return { success: false as const, error: result.error.message }
        }
        return { success: true };
    } catch (error) {
        return { success: false as const, error: getUserErrorMessage(error) };
    }
}