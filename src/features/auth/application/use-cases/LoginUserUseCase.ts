import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services";
import { AuthenticationError } from "@/shared/kernel";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ApplicationResultWithData } from "@/shared/kernel";


export class LoginUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(email: string, password: string): Promise<ApplicationResultWithData<User>> {
        try{
            const user = await this.authProvider.signInWithEmail(email, password);
            return { success: true as const, data: user }
        }
        catch(error) {
            return { success: false as const, error: new AuthenticationError(getUserErrorMessage(error))}
        }
    }
}