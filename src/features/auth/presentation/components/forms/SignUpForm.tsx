"use client"
import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import { useSignupForm } from "../../hooks";
import { SignUpFormValues } from "@/types/auth";

export function SignupForm() {
  const {form, signup} = useSignupForm();
  const { control } = form;
return (
<Form<SignUpFormValues>  
form={form}
id="signup-form"
description="Enter your details below to create an account"
submitText="Create Account"
onSubmit={signup} >


  <FieldGroup>
    
    {/* Email */}
    <InputField
      name="email"
      control={control}
      placeholder="Your email"
      label="Email" 
      autoComplete="email"
    />

    {/* Password */}
  <InputField
      control={control}
      name="password"
      label="Password" 
      placeholder={"Your password"} 
      autoComplete="new-password"
      type="password"
       />
</FieldGroup>
</Form>

  )
}
  
