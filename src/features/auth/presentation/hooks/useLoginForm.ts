"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { LoginFormValues } from "@/types";
import { login as loginAction } from "@/actions/auth/login";
import { getUserErrorMessage } from "@/lib/utils/errors";
export const useLoginForm = () => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const login = async (data: LoginFormValues) => {
    const {success, error} =  await  loginAction(data);
     if(!success) {
        form.setError("root", { message: getUserErrorMessage(error) });
      }
    }
    return {form, login};

}