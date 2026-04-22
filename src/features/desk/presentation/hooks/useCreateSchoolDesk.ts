"use client";
import { useCallback } from "react";
import { SchoolDeskForDetail } from "../../infrastructure/queries";
import { useAsyncAction } from "@/hooks";
import { createSchoolDeskAction } from "@/actions/desk";
import { toast } from "sonner";

export function useCreateSchoolDesk() {
    const { executeWithData: execute, error, isLoading} = useAsyncAction<SchoolDeskForDetail>();
    const createSchoolDesk = useCallback(async(schoolId: string) => {
        const result = await execute(() => createSchoolDeskAction(schoolId));
        if(result.success){
            return result.data;
        }
        toast.error(result.error);
        return null;

    }, [execute]);
   
    return { createSchoolDesk, error, isLoading};

}