"use client"
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import Link from "next/link";
import { LoginFormValues } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { useAuth } from "@/app/providers";

export function LoginForm() {
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
          email: "",
          password: "",
      },
  });
  return (
    <Form<LoginFormValues>
      form={form}
      showsCancelButton={false}
      showsDescription={true}
      description="Login to your account to start sharing your study materials"
      submitText="Log In"
      onSubmit={login}
    >
      <FieldGroup>
        {/* Email */}
        <InputField
          name="email"
          control={form.control}
          placeholder="Email"
          label="Email"
          required
          autoComplete="current-email"
        />

        {/* Password */}
        <div className="space-y-2">
          <InputField 
            placeholder="Your password" 
            control={form.control} 
            type="password" 
            label="Password" 
            name="password" 
            required
            autoComplete="current-password"
            
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="ml-auto font-medium inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </FieldGroup>
    </Form>
  );
}
