import { deleteNotebookAction } from "@/actions/notebook";
import { useUser } from "@/app/providers";
import { notebookKeys, deskKeys } from "@/lib/queries/keys";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

export const useDeleteNotebook = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const deleteMutation = useMutation({
        mutationKey: ["deleteNotebook"],
        mutationFn: async({notebookId}: {deskId: string; notebookId: string}) => {
            const result = await deleteNotebookAction(notebookId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }  
            return result.data;   
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: deskKeys.listByUserId(user.id)});

        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    const deleteNotebook = useCallback(async(input: {notebookId: string, deskId: string}) => {
        const {notebookId, deskId} = input;
        deleteMutation.mutate({notebookId, deskId});
    }, [deleteMutation]);
    return { deleteNotebook, isLoading: deleteMutation.isPending };
}