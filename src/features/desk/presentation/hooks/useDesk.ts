"use client";
import { useQuery } from "@tanstack/react-query";
import { getDeskById } from "../../server";
import { ApplicationError } from "@/lib/utils/errors";
import { deskKeys } from "@/lib/queries";

export function useDesk(deskId: string | null) {
    return useQuery({
        queryKey: deskKeys.detail(deskId ?? ""),
        queryFn: async () => {
            if(!deskId){
                throw new Error("deskId is required to fetch desk.");
            }
            const result = await getDeskById(deskId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!deskId,
       
    });
}