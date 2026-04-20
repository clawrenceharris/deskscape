import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotebooks } from "../../server";
import { NotebookForDetail } from "../../infrastructure/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { notebookKeys } from "@/lib/queries";

export function useNotebooks(select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    return useQuery({
        queryKey: notebookKeys.lists(),
        queryFn: async () => {
            const result = await getNotebooks();
            if(!result.success){
                throw new Error(result.error);
            }
            return result.data;
        },
        select,
    });
}
export function useNotebooksByUserId(userId: string | null, select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.listByUserId(userId ?? ""),
        initialData: queryClient.getQueryData(notebookKeys.listByUserId(userId ?? "")) as NotebookForDetail[] | undefined,
        queryFn: async () => {
            if (!userId) {
                throw new Error("userId is required to fetch notebooks by userId.");
            }
            const result = await getNotebooks({ where: { creatorId: userId } });
            if (!result.success) {
                throw new ApplicationError(result.error);
            }
            queryClient.setQueryData(notebookKeys.listByUserId(userId), result.data);
            return result.data;
    
        },
        select,
        enabled: !!userId,
    });
}
export function useNotebooksByDeskId(deskId: string | null, select?: (data: NotebookForDetail[]) => NotebookForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.listByDeskId(deskId ?? ""),
        initialData: queryClient.getQueryData(notebookKeys.listByDeskId(deskId ?? "")) as NotebookForDetail[] | undefined,
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch notebooks by deskId.");
            }
            const result = await getNotebooks({where: {deskId}});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            queryClient.setQueryData(notebookKeys.listByDeskId(deskId), result.data);
            return result.data;
        },
        enabled: !!deskId,
        select,
    });
}