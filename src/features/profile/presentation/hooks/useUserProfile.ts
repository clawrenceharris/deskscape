"use client";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../server";
import { profileKeys } from "@/lib/queries/keys";
import { ApplicationError } from "@/lib/utils/errors";

export function useUserProfile(userId: string | null) {
   return  useQuery({
        queryKey: profileKeys.detail(userId ?? ""),
        
        queryFn: async () =>{
            if(!userId){
                throw new Error("userId is required to fetch profile.");
            }
            const result = await getProfile(userId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!userId,
    });
}