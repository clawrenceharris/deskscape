"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/validation";
import { SignUpFormValues } from "@/types";
import { signupAction } from "@/actions/auth";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignupForm = () => {
  const router = useRouter();
    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const signup = async (data: SignUpFormValues) => {
      const result =  await  signupAction(data);
      if (result.success) {
        toast.success("Signup successful. Welcome to DeskShare!");
        router.push("/home");
      } else {
        form.setError("root", { message: getUserErrorMessage(result.error) });
      }
    }
    return { form, signup };
};