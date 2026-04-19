import { schoolKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { getUserSchools } from "../../server";
import { ApplicationError } from "@/lib/utils/errors";
import { SchoolForDetail } from "../../infrastructure/queries";

export function useUserSchools(userId: string, select?: (data: SchoolForDetail[]) => SchoolForDetail[]){
    return useQuery({
        queryKey: schoolKeys.listByUserId(userId),
        queryFn: async() => {
            
            const result = await getUserSchools(userId);
            if(!result.success){
               throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!userId,
        select,
    });
}