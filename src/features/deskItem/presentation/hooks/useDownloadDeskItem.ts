import { downloadDeskItemAction } from "@/actions/deskItem"
import { DownloadDeskItemInput } from "@/features/deskItem/application/dto";
import { deskItemKeys, deskKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react";
import { DeskItemForDetail } from "../../infrastructure/queries/deskItemQueries";

export const useDownloadDeskItem =  () => {
    const queryClient = useQueryClient();
    const downloadMutation = useMutation({
        mutationKey: ["downloadDeskItem"],
        mutationFn: async(input: DownloadDeskItemInput) => {
            const result = await downloadDeskItemAction(input);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onMutate: (variables) => {
            queryClient.setQueryData(deskItemKeys.detail(variables.deskItemId), (old: DeskItemForDetail) => {
                return {
                    ...old,
                    downloads: [...old.downloads, variables.deskItemId],
                };
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deskItemKeys.detail(variables.deskItemId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
        },
        onError: (_error, variables) => {
            queryClient.setQueryData(deskItemKeys.detail(variables.deskItemId), (old: DeskItemForDetail) => {
                return {
                    ...old,
                    downloads: old.downloads.filter((download) => download.profile.userId !== variables.userId),
                };
            });
            queryClient.invalidateQueries({ queryKey: deskItemKeys.detail(variables.deskItemId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
        },
    })
    const download = useCallback(async (input: DownloadDeskItemInput) => {
        downloadMutation.mutate(input);
    }, [downloadMutation]);
    return {download, isLoading: downloadMutation.isPending};
}