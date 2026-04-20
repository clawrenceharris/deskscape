import { ApplicationResult, AuthenticationError } from "@/shared/kernel";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class RequestPasswordResetUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(email: string): Promise<ApplicationResult> {
    try{
      await this.authProvider.requestPasswordReset(email);
      return { success: true as const };
    }
    catch(error){
      return { success: false as const, error: new AuthenticationError(getUserErrorMessage(error))}
    }
  }
}
