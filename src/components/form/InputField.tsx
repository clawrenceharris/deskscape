"use client"
import React from "react";
import {
    Control,
  Controller,
  FieldValues,
  Path,
  useController,
} from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from "../ui";
interface InputFieldProps<T extends FieldValues>  extends React.ComponentProps<"input">{
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder: string;
  description?: string;
  showsLabel?: boolean;
  isRequired?: boolean;
}
export function InputField<T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  description,
  showsLabel = true,
  isRequired = true,
  ...inputProps
}: InputFieldProps<T>) {
  const {field, fieldState } = useController<T>({
    control,
    name
  });
  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <Field>
          <FieldContent>
          <FieldLabel
            className={!showsLabel ? "sr-only" : ""}
              htmlFor={field.name}>
              {label}
              
            </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}

          </FieldContent>
          
          <Input
           {...field}
            {...inputProps}
            aria-required={isRequired}
            id={field.name}
            placeholder={`${placeholder}${isRequired ? "*" : " (Optional)"}`}
            aria-invalid={fieldState.invalid}
            
           
            
            
          />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
     
    />
  );
}