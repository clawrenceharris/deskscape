import { User } from "@supabase/supabase-js";
import { AuthProvider } from "../../domain/services/AuthProvider";

export class GetCurrentUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(): Promise<User | null> {
        const user = await this.authProvider.getUser();
        return user;
    }
}
