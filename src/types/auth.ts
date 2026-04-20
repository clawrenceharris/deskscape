import z from "zod";
import { forgotPasswordSchema, loginSchema, signUpSchema, resetPasswordSchema } from "@/lib/validation/auth";

export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;