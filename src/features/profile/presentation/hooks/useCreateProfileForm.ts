"use client";
import { createProfileSchema } from "@/lib/validation";
import { CreateProfileFormValues } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import {createOrUpdateProfileAction as createProfileAction } from "@/actions/profile";
import { useAsyncAction } from "@/hooks";
import { ProfileForDetail } from "../../infrastructure/queries";
import { useChangeUsername } from "./";
import { useAuth } from "@/features/auth/presentation/hooks";

type UseCreateProfileFormProps = {
    onSuccess?: (profile: ProfileForDetail) => void;
    onError?: (error: string) => void;
    userId: string;
}
export function useCreateProfileForm({userId, onSuccess, onError}: UseCreateProfileFormProps) {
    const {executeWithData: execute, isLoading, error} = useAsyncAction<ProfileForDetail>();
    const { user } = useAuth();
    const form = useForm<CreateProfileFormValues>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            displayName: "",
            username: user?.email?.split("@")[0] ?? "",
            avatarFile: null,
            schoolId: "",
        },
    });
    
    useChangeUsername({userId: user?.id ?? null, form});
    const createProfile = useCallback(async(data: CreateProfileFormValues) => {
        
        
        const result = await execute(() => createProfileAction({
            userId,
            username: data.username,
            displayName: data.displayName,
            avatarFile: data.avatarFile,
            schoolId: data.schoolId,
        }));
        if(result.success){
            return onSuccess?.(result.data);
        }
        form.setError("root", { message: result.error });
        onError?.(result.error);
       
        
        
    }, [execute, form,userId, onError, onSuccess]);
    return {form, isLoading, error, createProfile};
}