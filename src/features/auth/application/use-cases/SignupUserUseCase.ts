import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ApplicationResultWithData, AuthenticationError } from "@/shared/kernel";

export class SignupUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(email: string, password: string): Promise<ApplicationResultWithData<User>> {
        try{
            const user = await this.authProvider.signUp(email, password);
            if(!user){
                return { success: false as const, error: new AuthenticationError("Failed to create account.") };
            }
            return { success: true as const, data: user };
        }
        catch(error){
            return { success: false as const, error: new AuthenticationError(getUserErrorMessage(error)) };
        }
    }
}