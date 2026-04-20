

import z from "zod";

export const password = z.string()
.min(8, "Password must be at least 8 characters long")


export const email = z.email("Please enter a valid email address")
export const signUpSchema = z.object({
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  newPassword: password,
});

export const forgotPasswordSchema = z.object({
  email,
});