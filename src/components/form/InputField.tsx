"use client"
import React, { forwardRef } from "react";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input } from "../ui";
interface InputFieldProps<T extends FieldValues>  extends React.ComponentProps<"input">{
  name: Path<T>;
  label: string;
  control: Control<T>;
  description?: string;
  showsLabel?: boolean;
  renderInput?: ({field, fieldState, inputProps}: {field: ControllerRenderProps<T, Path<T>>; fieldState: ControllerFieldState; inputProps: React.ComponentProps<"input">}) => React.ReactNode;

}
function InputFieldInner<T extends FieldValues>(props: InputFieldProps<T>, ref: React.ForwardedRef<HTMLInputElement>) {
  
  const {
    name,
    label,
    placeholder,
    control,
    description,
    required,
    showsLabel = true,
    renderInput,
    ...inputProps
  } = props;
  
  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
        <Field ref={ref}>
          <FieldContent>
          <FieldLabel
            className={!showsLabel ? "sr-only" : ""}
              htmlFor={field.name}>
              {label} {" "}
              {required && <span className="text-primary font-bold">(required)</span>}
            </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}

          </FieldContent>
          
           {renderInput ? renderInput({field, fieldState, inputProps}) : 
           <Input
              {...field}
              {...inputProps}
              aria-required={required}
              id={field.name}
              placeholder={`${placeholder} ${!required ? "(Optional)" : ""}`}
              aria-invalid={fieldState.invalid}
    
            />}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
     
    />
  );
}


export const InputField = forwardRef(InputFieldInner) as <T extends FieldValues>(
  props: InputFieldProps<T> & React.RefAttributes<HTMLInputElement>,
) => React.ReactElement;
