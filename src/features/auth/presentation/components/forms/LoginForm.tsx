import { FieldGroup } from "@/components/ui";
import { Form, InputField } from "@/components/form";
import Link from "next/link";
import { LoginFormValues } from "@/types";
import { useLoginForm } from "../../hooks";

export function LoginForm() {
  const { form, login } = useLoginForm();
  return (
    <Form<LoginFormValues>
      form={form}
      showsCancelButton={false}
      showsDescription={true}
      description="Enter your email below to login to your account"
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
        />

        {/* Password */}
        <div className="space-y-2">
          <InputField placeholder="Your password" control={form.control} type="password" label="Password" name="password" />
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
