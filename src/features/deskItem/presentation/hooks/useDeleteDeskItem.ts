import { deleteDeskItemAction } from "@/actions/deskItem";
import { useUser } from "@/app/providers";
import { deskItemKeys, deskKeys } from "@/lib/queries/keys";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

export const useDeleteDeskItem = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const deleteMutation = useMutation({
        mutationKey: ["deleteDeskItem"],
        mutationFn: async({id}: {deskId: string; id: string}) => {
            const result = await deleteDeskItemAction(id);
            if(!result.success){
                throw new ApplicationError(result.error);
            }  
            return result.data;   
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deskItemKeys.lists() });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
            queryClient.invalidateQueries({queryKey: deskItemKeys.votes(variables.id)});
            queryClient.invalidateQueries({queryKey: deskKeys.listByUserId(user.id)});

        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    const deleteDeskItem = useCallback(async(input: {id: string, deskId: string}) => {
        const {id, deskId} = input;
        deleteMutation.mutate({id, deskId});
    }, [deleteMutation]);
    return { deleteDeskItem, isLoading: deleteMutation.isPending };
}