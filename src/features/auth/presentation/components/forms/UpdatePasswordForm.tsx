'use client'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { useRouter } from 'next/navigation'
import { Form, InputField } from '@/components/form'
import { ResetPasswordFormValues } from '@/types'
import { useResetPasswordForm } from '../../hooks'

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [success, setSuccess] = useState(false);  
  const router = useRouter();
  const { form, resetPassword } = useResetPasswordForm();
  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(data);
      setSuccess(true);

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ?
            <>
           
            <p className='text-muted-foreground'>Your password was successfully updated</p>
            <Button variant="link" className="text-primary-400" onClick={() => router.push("/auth/login")}>Log in</Button>
             </>
            :
            <Form<ResetPasswordFormValues>
            form={form}
            onSubmit={handleResetPassword}
            
          >
              <InputField
                control={form.control}
                label="New password"
                name="newPassword"
              />
             
          
          </Form>}
        </CardContent>
      </Card>
    </div>
  )
}
