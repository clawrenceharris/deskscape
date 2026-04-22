"use client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { schoolKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { getSchoolById } from "../../server";
import { SchoolForDetail } from "../../infrastructure/queries";
export function useSchool(schoolId: string | null): UseQueryResult<SchoolForDetail | null> {
    return useQuery({
        queryKey: schoolKeys.detail(schoolId ?? ""),
        queryFn: async () => {
            if(!schoolId){
                throw new Error("schoolId is required to fetch school.");
            } 
            const result = await getSchoolById(schoolId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!schoolId,
    });
}