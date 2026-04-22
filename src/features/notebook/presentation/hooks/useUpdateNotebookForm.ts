import { UpdateNotebookFormValues } from "@/types";
import { useNotebook } from "./useNotebook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNotebookSchema } from "@/lib/validation";
import { NotebookForDetail } from "../../infrastructure/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotebookAction } from "@/actions/notebook";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { useCallback, useState, useEffect } from "react";
import { notebookKeys } from "@/lib/queries";
import { withTimeout } from "@/lib/utils/withTimeout";
const UPDATE_DESK_ITEM_TIMEOUT_MS = 60_000;

type UseUpdateNotebookFormProps = {
    notebookId: string | null;
    onSuccess?: (notebook: NotebookForDetail) => void;
    onError?: (error: string) => void;
}
export function useUpdateNotebookForm({notebookId, onSuccess, onError}: UseUpdateNotebookFormProps) {
    const queryClient = useQueryClient();
    const { data: notebook } = useNotebook(notebookId);
    const form = useForm<UpdateNotebookFormValues>({
        resolver: zodResolver(updateNotebookSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
        },
    });
    const [removedMaterialIds, setRemovedMaterialIds] = useState<string[]>([]);

    useEffect(() => {
        if (!notebook) {
            return;
        }
        form.reset({
            title: notebook.title ?? "",
            description: notebook.description ?? "",
            materials: [],
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemovedMaterialIds([]);
    }, [notebook, form]);

    const toggleRemovedMaterialId = useCallback((materialId: string) => {
        setRemovedMaterialIds((previous) =>
            previous.includes(materialId)
                ? previous.filter((id) => id !== materialId)
                : [...previous, materialId]
        );
    }, []);

    const existingMaterials = notebook?.materials ?? [];

    const updateNotebookMutation = useMutation({
        mutationKey: ["updateNotebook"],
        retry: false,
        mutationFn: async(data: UpdateNotebookFormValues) => {

            if (!notebookId) {
                throw new ApplicationError("notebookId is required.");
            }
            const keepMaterialIds = existingMaterials
                .filter((material) => !removedMaterialIds.includes(material.id))
                .map((material) => material.id);
            const result = await withTimeout(
                updateNotebookAction({
                    notebookId,
                    data: {
                        title: data.title,
                        description: data.description,
                        materials: (data.materials ?? []).map((material) => ({
                            type: material.type ?? "OTHER",
                            file: material.file,
                        })),
                        removeMaterialIds: removedMaterialIds,
                        keepMaterialIds,
                    },
                }),
                UPDATE_DESK_ITEM_TIMEOUT_MS,
                "Updating this notebook timed out. Please try again."
            );
            if (!result.success) {
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (notebook) => {
            onSuccess?.(notebook);
            queryClient.invalidateQueries({ queryKey: notebookKeys.detail(notebook.id) });
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(notebook.deskId) });
            queryClient.invalidateQueries({ queryKey: notebookKeys.listByUserId(notebook.creatorId) });
        },
        onError: (error) => {
            const message = getUserErrorMessage(error);
            form.setError("root", { message });
            onError?.(message);
        },
    });

    const updateNotebook = useCallback(async (data: UpdateNotebookFormValues) => {
        return await updateNotebookMutation.mutateAsync(data);
    }, [updateNotebookMutation]);

    return {
        form,
        updateNotebook,
        isLoading: updateNotebookMutation.isPending,
        existingMaterials,
        removedMaterialIds,
        toggleRemovedMaterialId,
    };
}