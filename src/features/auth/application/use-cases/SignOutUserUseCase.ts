import { getUserErrorMessage } from "@/lib/utils/errors";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { AuthenticationError } from "@/shared/kernel";
import { ApplicationResult } from "@/shared/kernel";


export class SignOutUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(): Promise<ApplicationResult> {
        try{
            await this.authProvider.signOut();
            return { success: true }
        }
        catch(error){
            return { success: false, error: new AuthenticationError(getUserErrorMessage(error)) }
        }

    }
}