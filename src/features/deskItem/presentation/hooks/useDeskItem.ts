import { useQuery } from "@tanstack/react-query";
import { deskItemKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { getDeskItemById } from "../../server";

export function useDeskItem(deskItemId: string | null) {
    return useQuery({
        queryKey: deskItemKeys.detail(deskItemId ?? ""),
        queryFn: async () => {
            if(!deskItemId){
                throw new Error("deskItemId is required to fetch desk item.");
            }
            const result = await getDeskItemById(deskItemId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!deskItemId,
    });
}