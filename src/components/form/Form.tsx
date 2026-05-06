/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { type ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { Button, DialogFooter, Field, FieldDescription, FieldError, FieldGroup } from "@/components/ui";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BeforeUnload } from "@/components/form";
import { getUserErrorMessage } from "@/lib/utils/errors";

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
    <Field orientation="horizontal">
      {showsCancelButton && (
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
      )}

      {showsSubmitButton && (
        <Button
          type="submit"
          variant="tertiary"
          className={cn("flex-1", submitButtonClassName)}
          disabled={disabled}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            submitText
          )}
        </Button>
      )}
    </Field>
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
  const handleSubmit = async (data: T) => {
    try{
      return await onSubmit(data);
    }
    catch(error){
      form.setError("root", { message: getUserErrorMessage(error) });
    }
  };
  return (
    <BeforeUnload
      disabled={!form.formState.isDirty || !enableBeforeUnloadProtection}
    >
      <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("w-full h-full", className)}
        aria-describedby={description}>
            
          {description && showsDescription && (
            <FieldDescription className={descriptionClassName}>
              {description}
            </FieldDescription>
          )}
          <FieldGroup className="h-full justify-evenly">
          {typeof children === "function" ? children(form) : children}
          
          {/* General Error */}

          {form.formState.errors.root &&  
                <FieldError className="text-destructive">{form.formState.errors.root.message}</FieldError>
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

        </FieldGroup>
      </form>
      </FormProvider>
    </BeforeUnload>
  );
}