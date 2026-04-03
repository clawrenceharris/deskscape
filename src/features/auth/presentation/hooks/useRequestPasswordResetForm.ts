"use client"
import { ForgotPasswordFormValues } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/validation";

export const useRequestPasswordResetForm = () => {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
            
        },
    });
    const requestPasswordReset = async (data: ForgotPasswordFormValues) => {
        // const requestPasswordResetUseCase = makeRequestPasswordResetUseCase();
        // await requestPasswordResetUseCase.execute(data.email);
    }
    return {form, requestPasswordReset};
}