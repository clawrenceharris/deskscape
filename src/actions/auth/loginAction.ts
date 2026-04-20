"use server"

import { makeLoginUserUseCase } from "@/composition/auth";
import { loginSchema } from "@/lib/validation";
import { LoginFormValues } from "@/types";
import { ActionResultWithData } from "..";
import { User } from "@supabase/supabase-js";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function loginAction(rawInput: LoginFormValues): Promise<ActionResultWithData<User>> {
    const {data, success, error} = loginSchema.safeParse(rawInput);
  
    if (!success) {
      return {
        success: false as const,
        error: error.issues[0].message,
      };
    }
  
    try {
      const { email, password } = data;
      const useCase = await makeLoginUserUseCase();
      const result =  await useCase.execute(email, password);
      if(!result.success){
        return { success: false, error: result.error.message };
      }
      return result;
    } catch (error) {
      return { success: false as const, error: getUserErrorMessage(error) };
    }
  }