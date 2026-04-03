"use server"

import { makeSignupUserUseCase } from "@/composition/auth";
import { signUpSchema } from "@/lib/validation";

export async function signup(rawInput: unknown) {
    const {data, success, error} = signUpSchema.safeParse(rawInput);
  
    if (!success) {
      return {
        success: false as const,
        error: error.message,
      };
    }
  
    try {
      const {email, password} = data;
      // call use case here
      const signupUserUseCase = await makeSignupUserUseCase();
      await signupUserUseCase.execute(email, password);
      return { success: true as const, error: null };
    } catch (error) {
      return { success: false as const, error };
    }
  }