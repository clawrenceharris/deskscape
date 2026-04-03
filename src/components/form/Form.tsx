/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type FieldValues,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";
import { Button, DialogFooter, FieldDescription, FieldError } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";

export interface FormProps<T extends FieldValues>{
  children?: ((methods: UseFormReturn<T>) => ReactNode) | ReactNode;
  showsSubmitButton?: boolean;
  showsCancelButton?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit: (data: T) => any | Promise<any>;
  onCancel?: () => void;
  description?: string;
  descriptionClassName?: string;
  enableBeforeUnloadProtection?: boolean;
  submitButtonClassName?: string;
  className?: string;
  showsDescription?: boolean;
  isDialog?: boolean;
  id?: string;
  isLoading?: boolean;
  form: UseFormReturn<T>
}
type FormFooterProps = {
  showsCancelButton?: boolean;
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  showsSubmitButton?: boolean;
  submitButtonClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
}
function FormFooter({showsCancelButton,submitText, onCancel, cancelText, showsSubmitButton, submitButtonClassName, isLoading, disabled}: FormFooterProps){

  return (
    <div className="justify-end flex gap-3 mt-4">
              {showsCancelButton && (
                <Button
                  size={"lg"}
                  variant={"outline"}
                  type="button"
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              )}

              {showsSubmitButton && (
                <Button
                  type="submit"
                  variant="secondary"
                  className={cn("flex-1 max-w-md mx-auto", submitButtonClassName)}
                  size={"lg"}
                  disabled={disabled}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    submitText
                  )}
                </Button>
              )}
            </div>
  )
}

export function Form<T extends FieldValues>({
  children,
  showsSubmitButton = true,
  showsCancelButton = false,
  submitText = "Done",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  showsDescription,
  className,
  submitButtonClassName,
  description,
  descriptionClassName,
  enableBeforeUnloadProtection = false,
  id,
  form,
  isLoading,
  isDialog,
}: FormProps<T>) {
 
  const {formState: {disabled, isSubmitting}} = form;
  return (
    <BeforeUnload
      disabled={!form.formState.isDirty || !enableBeforeUnloadProtection}
    >
      
      <form
        id={id}
        onSubmit={(e) =>{
          e.preventDefault();
          form.clearErrors();
          form.handleSubmit(onSubmit)();
          
          
        }}
        className={cn("w-full h-full", className)}
        aria-describedby={description}>
        <div className="relative h-full flex flex-col justify-between">
            
          {description && showsDescription && (
            <FieldDescription className={descriptionClassName}>
              {description}
            </FieldDescription>
          )}
          {typeof children === "function" ? children(form) : children}
          
          {/* General Error */}

          {form.formState.errors.root &&  
            <div className="py-4 px-6 bg-destructive/9 mt-4 rounded-lg border-2 border-destructive/10">
                <FieldError className="text-destructive">{form.formState.errors.root.message}</FieldError>
            </div>
          }

          {isDialog ?

          <DialogFooter>
            <FormFooter 
            showsCancelButton={showsCancelButton} 
            submitText={submitText} 
            onCancel={onCancel} 
            cancelText={cancelText} 
            showsSubmitButton={showsSubmitButton} 
            submitButtonClassName={submitButtonClassName} 
            isLoading={isLoading || isSubmitting} 
            disabled={disabled || isLoading || isSubmitting} />
          </DialogFooter>
          :
          <FormFooter 
          showsCancelButton={showsCancelButton} 
          submitText={submitText} 
          onCancel={onCancel} 
          cancelText={cancelText} 
          showsSubmitButton={showsSubmitButton} 
          submitButtonClassName={submitButtonClassName} 
          isLoading={isLoading || isSubmitting} 
          disabled={disabled || isLoading || isSubmitting} />
          }

        </div>
      </form>
    </BeforeUnload>
  );
}