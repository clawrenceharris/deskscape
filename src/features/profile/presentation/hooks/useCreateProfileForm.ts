"use client";
import { createProfileSchema } from "@/lib/validation";
import { CreateProfileFormValues } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import {createOrUpdateProfileAction as createProfileAction } from "@/actions/profile";
import { User } from "@supabase/supabase-js";
import { useAsyncAction } from "@/hooks";
import { ProfileForDetail } from "../../infrastructure/queries";
import { useChangeUsername } from "./";

type UseCreateProfileFormProps = {
    onSuccess?: (profile: ProfileForDetail) => void;
    onError?: (error: string) => void;
    user: User;
}
export function useCreateProfileForm({user, onSuccess, onError}: UseCreateProfileFormProps) {
    const {executeWithData: execute, isLoading, error} = useAsyncAction<ProfileForDetail>();
    const form = useForm<CreateProfileFormValues>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            displayName: "",
            username: user.email?.split("@")[0] ?? "",
            avatarFile: null,
            schoolId: "",
        },
    });
    
    useChangeUsername({userId: user.id, form});
    const createProfile = useCallback(async(data: CreateProfileFormValues) => {
        
     
        const result = await execute(() => createProfileAction({
            userId: user.id,
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
       
        
        
    }, [execute, form, user.id, onSuccess, onError]);
    return {form, isLoading, error, createProfile};
}