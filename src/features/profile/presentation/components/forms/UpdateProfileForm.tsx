"use client";

import { Form, InputField } from "@/components/form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui";
import { UpdateProfileFormValues } from "@/types/profile";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { Pencil, User as UserIcon } from "lucide-react";
import {
  Control,
  Controller,
  useWatch,
} from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useUpdateProfileForm } from "../../hooks";
import { SearchSelect } from "@/components/shared";
import { useSchools } from "@/features/school/presentation/hooks";
type ProfileAvatarFieldProps = {
  profile: ProfileForDetail;
  control: Control<UpdateProfileFormValues>;

}
type UpdateProfileFormProps = {
  onSuccess?: (profile: ProfileForDetail) => void;
  profile: ProfileForDetail;
  onCancel?: () => void;
};

const AVATAR_INPUT_ID = "profileImage-upload";

function ProfileAvatarField({
  control,
  profile

}: ProfileAvatarFieldProps) {
  const file = useWatch({ control, name: "avatarFile" });
  const previewUrl = useMemo(() => {
    if (file instanceof File && file.size > 0) {
      return URL.createObjectURL(file);
    }
    
    return profile?.avatarUrl ?? null;
  }, [file, profile?.avatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {

        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Controller
      name="avatarFile"
      control={control}
      render={({ field, fieldState }) => (
        <Field
          className="mb-6 flex flex-col items-center"
          data-invalid={fieldState.invalid ? true : undefined}
        >
          <FieldContent className="items-center text-center">
            <FieldLabel htmlFor={AVATAR_INPUT_ID}>
              Profile photo
              <span className="text-muted-foreground text-sm font-normal">
                (Optional)
              </span>
            </FieldLabel>
            <FieldDescription>
              JPG, PNG or GIF. Square images work best.
            </FieldDescription>
          </FieldContent>
          <label
            htmlFor={AVATAR_INPUT_ID}
            className="group relative flex max-w-30 h-30 w-full cursor-pointer justify-center rounded-full transition-all duration-300 hover:shadow-lg shadow-secondary/50"
          >
            <Avatar className="h-30 w-30 rounded-full border-2 border-muted bg-input/20 object-cover">
              <AvatarImage
                src={previewUrl ?? undefined}
                alt="Profile preview"
                className="object-cover"
              />
             
              <AvatarFallback className="rounded-full group-hover:hidden">
                <UserIcon className="size-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div
              className={`
                pointer-events-none absolute inset-0 flex items-center justify-center rounded-full
                bg-secondary/80 opacity-0 transition-opacity group-hover:opacity-100
              `}
            >
                <Pencil className="size-8 text-white hidden group-hover:block" />
            </div>
            <input
              ref={field.ref}
              name={field.name}
              onBlur={field.onBlur}
              id={AVATAR_INPUT_ID}
              type="file"
              accept="image/*"
              aria-invalid={fieldState.invalid}
              aria-required={false}
              className="sr-only"
              onChange={(e) => {
                const next = e.target.files?.[0] ?? null;
                field.onChange(next);
              }}
            />
          </label>
          {fieldState.invalid ? (
            <FieldError errors={[fieldState.error]} />
          ) : null}
        </Field>
      )}
    />
  );
}

export function UpdateProfileForm({
  onSuccess,
  profile,
  onCancel
}: UpdateProfileFormProps) {
  const { form, isLoading, updateProfile } = useUpdateProfileForm({profile, onSuccess });
  const { control } = form;
  const {data: schools = [], isLoading: isLoadingSchools} = useSchools();  
  return (
    <Form<UpdateProfileFormValues>
        isLoading={isLoading}
        form={form}
        isDialog
        showsCancelButton={false}
        onCancel={onCancel}
        onSubmit={updateProfile}>
      <ProfileAvatarField control={control} profile={profile} />
      <FieldGroup>
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
              onChange={(value) => form.setValue("schoolId", value)}
              placeholder="Select a school"
              searchPlaceholder="Find a school"
              newItemLabel="Add school"
            />
        )}
        
        />
       
        <InputField
          placeholder="Display name"
          name="displayName"
          required={false}
          label="Display name"
          control={control}
        />
        <InputField
          placeholder="Username"
          name="username"
          required
          label="Username"
          control={control}
        />
        
      </FieldGroup>
    </Form>
  );
}
