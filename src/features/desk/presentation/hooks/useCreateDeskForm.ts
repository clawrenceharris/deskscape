"use client";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeskSchema } from "@/lib/validation";
import type { CreateDeskFormValues } from "@/types";
import { useAsyncAction } from "@/hooks";
import { createDeskAction } from "@/actions/desk";
import { DeskForDetail } from "../../infrastructure/queries";
import { useUserProfile } from "@/features/profile/presentation/hooks";

type UseCreateDeskFormProps = {
    userId: string;
    onSuccess?: (desk: DeskForDetail) => void;
    onError?: (error: string) => void;
}
export function useCreateDeskForm ({userId, onSuccess, onError}: UseCreateDeskFormProps) {
    const { executeWithData: execute, isLoading} = useAsyncAction<DeskForDetail>();
    const {data: profile} = useUserProfile(userId);
    const form = useForm<CreateDeskFormValues>({
        resolver: zodResolver(createDeskSchema),
        defaultValues: {
            name: "",
            schoolId: profile?.school?.id ?? "",
            imageFile: null,
            isPublic: true,
            description: "",
        },
    });

    const createDesk = useCallback(async(data: CreateDeskFormValues) => {
        const result = await execute(() => createDeskAction({
            creatorId: userId,
            name: data.name,
            schoolId: data.schoolId,
            imageFile: data.imageFile,
            isPublic: data.isPublic ?? true,
            description: data.description,
        }));
        if(result.success){
            return onSuccess?.(result.data);
        }
        form.setError("root", { message: result.error });
        onError?.(result.error);
    }, [execute, form, onError, onSuccess, userId]);
    return {form, createDesk, isLoading};
}