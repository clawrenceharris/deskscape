import { ApplicationError, ApplicationResult } from "@/shared/kernel";
import { AuthProvider } from "../../domain/services/AuthProvider";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class ResetPasswordUseCase {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(newPassword: string, token: string): Promise<ApplicationResult> {
    try{
      await this.authProvider.resetPassword(newPassword, token);
      return {success: true as const}
    }
    catch(error){
      return { success: false as const, error: new ApplicationError(getUserErrorMessage(error))}
    }
    
  }
}
