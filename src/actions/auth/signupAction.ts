"use server"

import { makeSignupUserUseCase } from "@/composition/auth";
import { signUpSchema } from "@/lib/validation";
import { SignUpFormValues } from "@/types";
import { ActionResultWithData } from "..";
import { User } from "@supabase/supabase-js";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function signupAction(input: SignUpFormValues): Promise<ActionResultWithData<User>> {
    const {data, success, error} = signUpSchema.safeParse(input);
  
    if (!success) {
      return {
        success: false as const,
        error: error.message,
      };
    }
  
    try {
      const {email, password} = data;
      // call use case here
      const useCase = await makeSignupUserUseCase();
      const result = await useCase.execute(email, password);
      if(!result.success){
        return { success: false, error: result.error.message}
      }
      return result;
    } catch (error) {
      return { success: false as const, error: getUserErrorMessage(error) };
    }
  }