"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateNotebookFormValues } from "@/types";
import { createNotebookSchema } from "@/lib/validation";
import { useCallback } from "react";
import { createNotebookAction } from "@/actions/notebook";
import { NotebookForDetail } from "../../infrastructure/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { notebookKeys } from "@/lib/queries";

type UseCreateNotebookFormProps = {
    deskId: string;
    onSuccess?: (notebook: NotebookForDetail) => void;
    onError?: (error: string) => void;
}
export function useCreateNotebookForm({deskId, onSuccess, onError}: UseCreateNotebookFormProps) {
    const queryClient = useQueryClient();
    const form = useForm<CreateNotebookFormValues>({
        resolver: zodResolver(createNotebookSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
            
        },
    });

    const createNotebookMutation = useMutation({
        mutationFn: async(data: CreateNotebookFormValues) => {
            const result = await createNotebookAction({
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
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(deskId) });
        },
        onError: (error) => {
            form.setError("root", { message: getUserErrorMessage(error) });
            onError?.(getUserErrorMessage(error));
        },
    });
    const createNotebook = useCallback(async(data: CreateNotebookFormValues) => {
        return await createNotebookMutation.mutateAsync(data);
    }, [createNotebookMutation]);
    return {form, createNotebook, error: createNotebookMutation.error, isLoading: createNotebookMutation.isPending };
}