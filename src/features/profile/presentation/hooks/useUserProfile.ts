"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getProfile } from "@/actions/profile/getProfile";
import { profileKeys } from "@/lib/queries/keys";
import { ApplicationError } from "@/lib/utils/errors";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { withTimeout } from "@/lib/utils/withTimeout";
const PROFILE_QUERY_TIMEOUT_MS = 10_000;
    
export function useUserProfile(userId: string | null): UseQueryResult<ProfileForDetail | null> {
   return  useQuery({
        queryKey: profileKeys.detail(userId ?? ""),
        
        queryFn: async () =>{
            if(!userId){
                throw new Error("userId is required to fetch profile.");
            }
            const result = await withTimeout(getProfile(userId), 
            PROFILE_QUERY_TIMEOUT_MS, 
            "Loading profile timed out. Please try again.");
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        
        enabled: !!userId,
    });
}