"use client";
import { FieldGroup, Textarea } from "@/components/ui";
import { useController, useFormContext } from "react-hook-form";
import { CreateDeskItemFormValues } from "@/types/desk";
import { InputField } from "@/components/form";

export function ItemDetailsSection() {
  const { control } = useFormContext<CreateDeskItemFormValues>();
  const { field: descriptionField } = useController({
    control,
    name: "description",
  });
  return (
    <FieldGroup className="h-full flex-1 bg-popover">
            <InputField
              control={control} 
              name="title" 
              label="Title" 
              placeholder="Enter the title of the desk item" 
              required
            />
            <InputField 
              control={control} 
              name="description" 
              label="Description" 
              required={false}
              renderInput={() => (
                <Textarea 
                  {...descriptionField}  
                  placeholder="Enter a description for this desk item" 
                  rows={4}
                  maxLength={400}
                />
              )}
            />
            
            
        </FieldGroup>
  );
}