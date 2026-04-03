import { AuthProvider } from "../../domain/services/AuthProvider";

export class SignOutUserUseCase {
    constructor(private readonly authProvider: AuthProvider) {}

    async execute(): Promise<void> {
        return await this.authProvider.signOut();
    }
}