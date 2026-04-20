import { downloadNotebookAction } from "@/actions/notebook"
import { DownloadNotebookInput } from "@/features/notebook/application/dto";
import { notebookKeys, deskKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react";
import { NotebookForDetail } from "../../infrastructure/queries/notebookQueries";

export const useDownloadNotebook =  () => {
    const queryClient = useQueryClient();
    const downloadMutation = useMutation({
        mutationKey: ["downloadNotebook"],
        mutationFn: async(input: DownloadNotebookInput) => {
            const result = await downloadNotebookAction(input);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onMutate: (variables) => {
            queryClient.setQueryData(notebookKeys.detail(variables.notebookId), (old: NotebookForDetail) => {
                return {
                    ...old,
                    downloads: [...old.downloads, variables.notebookId],
                };
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: notebookKeys.detail(variables.notebookId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
        },
        onError: (_error, variables) => {
            queryClient.setQueryData(notebookKeys.detail(variables.notebookId), (old: NotebookForDetail) => {
                return {
                    ...old,
                    downloads: old.downloads.filter((download) => download.profile.userId !== variables.userId),
                };
            });
            queryClient.invalidateQueries({ queryKey: notebookKeys.detail(variables.notebookId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
        },
    })
    const download = useCallback(async (input: DownloadNotebookInput) => {
        downloadMutation.mutate(input);
    }, [downloadMutation]);
    return {download, isLoading: downloadMutation.isPending};
}