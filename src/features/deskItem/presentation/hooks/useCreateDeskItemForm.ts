"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateDeskItemFormValues } from "@/types";
import { createDeskItemSchema } from "@/lib/validation";
import { useCallback } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { createDeskItemAction } from "@/actions/deskItem";
import { DeskItemForDetail } from "../../infrastructure/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { deskItemKeys } from "@/lib/queries";
type UseCreateDeskItemFormProps = {
    deskId: string;
    onSuccess?: (deskItem: DeskItemForDetail) => void;
    onError?: (error: string) => void;
}
export function useCreateDeskItemForm({deskId, onSuccess, onError}: UseCreateDeskItemFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<CreateDeskItemFormValues>({
        resolver: zodResolver(createDeskItemSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
            
        },
    });

    /**
     * async(data: CreateDeskItemFormValues) => {
        const result = await execute(() => createDeskItemAction({
            ...data,
            deskId,
            materials: data.materials.map(material => ({
                type: material.type ?? "NOTES",
                file: material.file,
            })),
        }));
        if(result.success){
            return onSuccess?.(result.data);
        }
        form.setError("root", { message: result.error });
        onError?.(result.error);
    }
     */
    const createDeskItemMutation = useMutation({
        mutationFn: async(data: CreateDeskItemFormValues) => {
            const result = await createDeskItemAction({
                deskId,
                data: { 
                    title: data.title,
                    description: data.description,
                    materials: data.materials.map(material => ({
                        type: material.type ?? "OTHER",
                        file: material.file,
                    }))
                },
            });
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (data) => {
            onSuccess?.(data);
            queryClient.invalidateQueries({ queryKey: deskItemKeys.listByDeskId(deskId) });
        },
        onError: (error) => {
            form.setError("root", { message: getUserErrorMessage(error) });
            onError?.(getUserErrorMessage(error));
        },
    });
    const createDeskItem = useCallback(async(data: CreateDeskItemFormValues) => {
        return await createDeskItemMutation.mutateAsync(data);
    }, [createDeskItemMutation]);
    return {form,createDeskItem, error: createDeskItemMutation.error, isLoading: createDeskItemMutation.isPending };
}