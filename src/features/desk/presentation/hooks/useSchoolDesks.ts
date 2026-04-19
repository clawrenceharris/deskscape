import { useQuery } from "@tanstack/react-query";
import { getSchoolDesks } from "../../server";
import { DeskForDetail } from "../../infrastructure/queries";
import { deskKeys } from "@/lib/queries";
export function useSchoolDesks (schoolId: string, select?: (data: DeskForDetail[]) => DeskForDetail[]) {
    return useQuery({
        queryKey: deskKeys.listBySchoolId(schoolId),
        queryFn: async() => {
            const result = await getSchoolDesks(schoolId);
            if(!result.success){
                return [];
            }
            return result.data;
        },
        enabled: !!schoolId,
        select,
    });
}