import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services/AuthProvider";

export class SignupUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(email: string, password: string): Promise<User | null> {
        return await this.authProvider.signUp(email, password);
    }
}