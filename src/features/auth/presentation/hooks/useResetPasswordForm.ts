"use client"
import { resetPasswordSchema } from "@/lib/validation";
import { ResetPasswordFormValues } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useResetPasswordForm = () => {
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
        },
    }); 

    const resetPassword = async (data: ResetPasswordFormValues) => {
        // TODO: Implement reset password
        console.log(data);
    }
    return {form, resetPassword};
}