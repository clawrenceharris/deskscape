"use server"
import { getUserErrorMessage } from "@/lib/utils/errors";
import { makeSignOutUserUseCase } from "@/composition/auth";

type SignOutActionResult = {
    success: true;
    error: null;
} | {
    success: false;
    error: {message: string};
}
export async function signOut(): Promise<SignOutActionResult> {
    try {

        const signOutUserUseCase = await makeSignOutUserUseCase();
        await signOutUserUseCase.execute();
        return { success: true, error: null };
    } catch (error) {
        return { success: false as const, error: {message: getUserErrorMessage(error as Error)} };
    }
}