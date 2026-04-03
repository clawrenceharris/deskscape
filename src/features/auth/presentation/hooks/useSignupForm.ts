"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/validation";
import { SignUpFormValues } from "@/types";
import { signup as signupAction } from "@/actions/auth";
import { getUserErrorMessage } from "@/lib/utils/errors";

export const useSignupForm = () => {
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const signup = async (data: SignUpFormValues) => {
      const {success, error} =  await  signupAction(data);
      if (success) {
        console.log("Signup successful");
      } else {
        form.setError("root", { message: getUserErrorMessage(error) });
      }
    }
    return { form, signup };
};