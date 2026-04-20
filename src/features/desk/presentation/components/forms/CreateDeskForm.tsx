"use client";
import { Form, InputField } from "@/components/form";
import { CreateDeskFormValues } from "@/types";
import { DeskForDetail } from "../../../infrastructure/queries";
import { useCreateDeskForm } from "../../hooks";
import {SearchSelect} from "@/components/shared";
import { Switch } from "@/components/ui";
import { useSchools } from "@/features/school/presentation/hooks";


type CreateDeskFormProps = {
  userId: string;
  onSuccess?: (desk: DeskForDetail) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}
export function CreateDeskForm({userId,onCancel, onSuccess, onError}: CreateDeskFormProps) {
  const {form, createDesk, isLoading} = useCreateDeskForm({userId, onSuccess, onError});
  const {control, setValue} = form;
  const {data: schools = [], isLoading: isLoadingSchools} = useSchools();  
  
  const handleSchoolChange = (value: string) => {
    console.log(value);
    if(value.startsWith("__new__:")) {
      const newSchoolName = value.split("__new__:")[1];
      console.log(newSchoolName);
    } else {
      setValue("schoolId", value);
    }
  }
  return (
    <Form<CreateDeskFormValues>
      form={form}
      onCancel={onCancel}
      isLoading={isLoading}
      onSubmit={createDesk}
      enableBeforeUnloadProtection
    >
    
        <InputField
          name="name"
          control={control}
          label="Name"
          placeholder="Enter the name of the desk"
          required
        />
        
        <InputField 
        
        name="schoolId"
        control={control}
        label="School"
        placeholder="Select a school"
        required
        renderInput={() => (

            <SearchSelect
              items={schools.map((school) => ({
                value: school.id,
                label: school.name,
              }))}
              disabled={isLoadingSchools}
              value={form.getValues("schoolId")}
              onChange={handleSchoolChange}
              placeholder="Select a school"
              searchPlaceholder="Find a school"
              newItemLabel="Add school"
            />
        )}
        
        />
       
        <InputField<CreateDeskFormValues>
          name="isPublic"
          control={control}
          label="Privacy"
          required={false}
          renderInput={({ field }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Public</span>
              <Switch
                size="lg"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                id="isPublic-switch"
                name="isPublic"
              />
            </div>
            )}
          />
    </Form>
  );
}