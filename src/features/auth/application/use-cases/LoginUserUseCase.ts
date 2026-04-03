import { AuthProvider } from "../../domain/services";

export class LoginUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(email: string, password: string): Promise<void> {
        await this.authProvider.signInWithEmail(email, password);
        
    }
}