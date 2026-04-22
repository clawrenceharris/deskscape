"use client"
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import { SignUpFormValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/providers";

export function SignupForm() {
  const { signup } = useAuth();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
        email: "",
        password: "",
    },
});
  const { control } = form;
return (
  <Form<SignUpFormValues>  
  form={form}
  id="signup-form"
  description="Create your account to start sharing your study materials"
  submitText="Create Account"
  onSubmit={signup}
  showsDescription={true}
  >

    <FieldGroup>
      
      {/* Email */}
      <InputField
        name="email"
        control={control}
        placeholder="Your email"
        label="Email" 
        autoComplete="email"
        required
      />

      {/* Password */}
      <InputField
        control={control}
        name="password"
        label="Password" 
        placeholder={"Your password"} 
        autoComplete="new-password"
        type="password"
        required
      />
    </FieldGroup>
  </Form>

  )
}
  
