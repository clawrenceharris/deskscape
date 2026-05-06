"use client";
import { useQuery } from "@tanstack/react-query";
import { getUserDesks } from "@/actions/desk/getUserDesks";
import { DeskForDetail } from "../../infrastructure/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { deskKeys } from "@/lib/queries";

export function useUserDesks(userId: string, select?: (data: DeskForDetail[]) => DeskForDetail[]){
    return useQuery({
        queryKey: deskKeys.listByUserId(userId),
        queryFn: async() => {
            
            const result = await getUserDesks(userId);
            if(!result.success){
               throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}