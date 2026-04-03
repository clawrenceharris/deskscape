import { AuthProvider } from "../../domain/services/AuthProvider";

export class ResetPasswordUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(newPassword: string, token: string): Promise<void> {
    await this.authProvider.resetPassword(newPassword, token);
  }
}
