"use client";
import { FieldGroup, Textarea } from "@/components/ui";
import { useController, useFormContext } from "react-hook-form";
import { CreateNotebookFormValues } from "@/types/desk";
import { InputField } from "@/components/form";

export function NotebookDetailsSection() {
  const { control } = useFormContext<CreateNotebookFormValues>();
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
              placeholder="What should this notebook be called?" 
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
                  placeholder="Enter a description for this notebook" 
                  rows={4}
                  maxLength={400}
                />
              )}
            />
            
            
        </FieldGroup>
  );
}