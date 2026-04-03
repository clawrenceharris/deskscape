"use client";
import { createProfileSchema } from "@/lib/validation";
import { CreateProfileFormValues, UserProfileDto } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import {checkUsernameAvailability, createOrUpdateProfile as createProfileAction } from "@/actions/profile";
import { User } from "@supabase/supabase-js";

type UseCreateProfileFormProps = {
    onSuccess?: (profile: UserProfileDto) => void;
    onError?: (error: string) => void;
    user: User;
}
export function useCreateProfileForm({user, onSuccess, onError}: UseCreateProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<CreateProfileFormValues>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            displayName: "",
            username: user.email?.split("@")[0] ?? "",
            avatarFile: null,

        },
    });
    const handleUsernameChange = useCallback(async(username: string) => {
        if(!username) {
            return;
        }
        form.clearErrors("username");
        const {error} = await checkUsernameAvailability(username);
        
        if(error){
            form.setError("username", {message: getUserErrorMessage(error)});
        }
       
     

    }, [form]);

    
    const createProfile = useCallback(async(data: CreateProfileFormValues) => {
        
        try {
            setIsLoading(true);
            const result = await createProfileAction(user.id, data);
            if(!result.success){
                 throw new ApplicationError(result.error.message);
            }
            onSuccess?.({
                userId: result.data.userId,
                username: result.data.username,
                displayName: result.data.displayName ?? null,
                avatarUrl: result.data.avatarUrl,
                avatarPath: result.data.avatarPath,
            });
        } catch(error) {
            onError?.(getUserErrorMessage(error));
            form.setError("root", { message: getUserErrorMessage(error) });
        } finally {
            setIsLoading(false);
        }
        
    }, [user.id, onSuccess, onError, form]);
    return {form,isLoading, handleUsernameChange, createProfile};
}