import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeskItems } from "../../server";
import { DeskItemForDetail } from "../../infrastructure/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { deskItemKeys } from "@/lib/queries";

export function useDeskItems(select?: (data: DeskItemForDetail[]) => DeskItemForDetail[]) {
    return useQuery({
        queryKey: deskItemKeys.lists(),
        queryFn: async () => {
            const result = await getDeskItems();
            if(!result.success){
                throw new Error(result.error);
            }
            return result.data;
        },
        select,
    });
}
export function useDeskItemsByUserId(userId: string | null, select?: (data: DeskItemForDetail[]) => DeskItemForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: deskItemKeys.listByUserId(userId ?? ""),
        initialData: queryClient.getQueryData(deskItemKeys.listByUserId(userId ?? "")) as DeskItemForDetail[] | undefined,
        queryFn: async () => {
            if (!userId) {
                throw new Error("userId is required to fetch desk items by userId.");
            }
            const result = await getDeskItems({ where: { creatorId: userId } });
            if (!result.success) {
                throw new ApplicationError(result.error);
            }
            queryClient.setQueryData(deskItemKeys.listByUserId(userId), result.data);
            return result.data;
    
        },
        select,
        enabled: !!userId,
    });
}
export function useDeskItemsByDeskId(deskId: string | null, select?: (data: DeskItemForDetail[]) => DeskItemForDetail[]) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: deskItemKeys.listByDeskId(deskId ?? ""),
        initialData: queryClient.getQueryData(deskItemKeys.listByDeskId(deskId ?? "")) as DeskItemForDetail[] | undefined,
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch desk items by deskId.");
            }
            const result = await getDeskItems({where: {deskId}});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            queryClient.setQueryData(deskItemKeys.listByDeskId(deskId), result.data);
            return result.data;
        },
        enabled: !!deskId,
        select,
    });
}