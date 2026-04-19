"use server"

import { makeLoginUserUseCase } from "@/composition/auth";
import { loginSchema } from "@/lib/validation";

type LoginActionResult = {
  success: boolean;
  error: { message: string } | unknown;
};
export async function login(rawInput: unknown): Promise<LoginActionResult> {
    const {data, success, error} = loginSchema.safeParse(rawInput);
  
    if (!success) {
      return {
        success: false as const,
        error: {message: error.issues[0].message},
      };
    }
  
    try {
      const { email, password } = data;
      const loginUserUseCase = await makeLoginUserUseCase();
      await loginUserUseCase.execute(email, password);
      return { success: true as const, error: null };
    } catch (error) {
      return { success: false as const, error };
    }
  }