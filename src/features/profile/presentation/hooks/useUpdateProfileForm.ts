import { updateProfileSchema } from "@/lib/validation";
import { UpdateProfileFormValues } from "@/types/profile";
import { useMutation } from "@tanstack/react-query";
import { ProfileForDetail } from "../../infrastructure/queries";
import { updateProfileAction } from "@/actions/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { useChangeUsername } from "./useChangeUsername";
import { useCallback } from "react";

type UseUpdateProfileFormProps = {
    onSuccess?: (profile: ProfileForDetail) => void;
    onError?: (error: string) => void;
    profile: ProfileForDetail;
}
export const useUpdateProfileForm = ({onSuccess, onError, profile}: UseUpdateProfileFormProps) => {
    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            displayName: profile.displayName ?? "",
            username: profile.username,
            avatarFile: null,
            schoolId: profile.school?.id ?? "",
        },
    });
    useChangeUsername({userId: profile.userId, form});

    const updateProfileMutation = useMutation({
        mutationFn: async(data: UpdateProfileFormValues) => {
            const result = await updateProfileAction({
                userId: profile.userId,
                data,
            });
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;

        },
        onSuccess: (data) => {
            onSuccess?.(data);
        },
        onError: (error) => {
            form.setError("root", { message: getUserErrorMessage(error) });
            onError?.(getUserErrorMessage(error));
        },
    });
    const updateProfile = useCallback((data: UpdateProfileFormValues) => {
        if(!form.formState.isValid) return;
        
        return updateProfileMutation.mutate(data);
        

    }, [form.formState.isValid, updateProfileMutation]);
  return {
    form,
    isLoading: updateProfileMutation.isPending,
    updateProfile,
  };
};