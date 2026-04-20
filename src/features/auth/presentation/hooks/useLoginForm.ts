"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { LoginFormValues } from "@/types";
import { loginAction } from "@/actions/auth/loginAction";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { useRouter } from "next/navigation";
import { useAsyncAction } from "@/hooks";

export const useLoginForm = () => {
    const { executeWithData: execute } = useAsyncAction();
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const login = async (data: LoginFormValues) => {
        const result = await execute(() => loginAction(data));
        if(result.success) {
            router.push("/home");
            return result.data;
        }
        form.setError("root", { message: getUserErrorMessage(result.error) });
    }
    return {form, login};

}