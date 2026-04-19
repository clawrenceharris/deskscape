import { UpdateDeskItemFormValues } from "@/types";
import { useDeskItem } from "./useDeskItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDeskItemSchema } from "@/lib/validation";
import { DeskItemForDetail } from "../../infrastructure/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDeskItemAction } from "@/actions/deskItem";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { useCallback, useMemo, useState, useEffect } from "react";
import { deskItemKeys } from "@/lib/queries";

type UseUpdateDeskItemFormProps = {
    deskItemId: string | null;
    onSuccess?: (deskItem: DeskItemForDetail) => void;
    onError?: (error: string) => void;
}
export function useUpdateDeskItemForm({deskItemId, onSuccess, onError}: UseUpdateDeskItemFormProps) {
    const queryClient = useQueryClient();
    const { data: deskItem } = useDeskItem(deskItemId);
    const form = useForm<UpdateDeskItemFormValues>({
        resolver: zodResolver(updateDeskItemSchema),
        defaultValues: {
            title: "",
            description: "",
            materials: [],
        },
    });
    const [removedMaterialIds, setRemovedMaterialIds] = useState<string[]>([]);

    useEffect(() => {
        if (!deskItem) {
            return;
        }
        form.reset({
            title: deskItem.title ?? "",
            description: deskItem.description ?? "",
            materials: [],
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemovedMaterialIds([]);
    }, [deskItem, form]);

    const toggleRemovedMaterialId = useCallback((materialId: string) => {
        setRemovedMaterialIds((previous) =>
            previous.includes(materialId)
                ? previous.filter((id) => id !== materialId)
                : [...previous, materialId]
        );
    }, []);

    const existingMaterials = useMemo(() => deskItem?.materials ?? [], [deskItem?.materials]);

    const updateDeskItemMutation = useMutation({
        mutationFn: async(data: UpdateDeskItemFormValues) => {
            if (!deskItemId) {
                throw new ApplicationError("Desk item id is required.");
            }
            const keepMaterialIds = existingMaterials
                .filter((material) => !removedMaterialIds.includes(material.id))
                .map((material) => material.id);
            const result = await updateDeskItemAction({
                deskItemId,
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
            });
            if (!result.success) {
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        onSuccess: (updatedDeskItem) => {
            onSuccess?.(updatedDeskItem);
            queryClient.invalidateQueries({ queryKey: deskItemKeys.detail(updatedDeskItem.id) });
            queryClient.invalidateQueries({ queryKey: deskItemKeys.listByDeskId(updatedDeskItem.deskId) });
            queryClient.invalidateQueries({ queryKey: deskItemKeys.listByUserId(updatedDeskItem.creatorId) });
        },
        onError: (error) => {
            const message = getUserErrorMessage(error);
            form.setError("root", { message });
            onError?.(message);
        },
    });

    const updateDeskItem = useCallback(async (data: UpdateDeskItemFormValues) => {
        return await updateDeskItemMutation.mutateAsync(data);
    }, [updateDeskItemMutation]);

    return {
        form,
        updateDeskItem,
        isLoading: updateDeskItemMutation.isPending,
        existingMaterials,
        removedMaterialIds,
        toggleRemovedMaterialId,
    };
}