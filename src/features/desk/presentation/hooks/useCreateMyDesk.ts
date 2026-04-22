"use client";
import { useCallback } from "react";
import { DeskForDetail } from "../../infrastructure/queries";
import { useAsyncAction } from "@/hooks";
import { createMyDeskAction } from "@/actions/desk";
import { toast } from "sonner";

export function useCreateMyDesk() {
    const { executeWithData: execute, error, isLoading} = useAsyncAction<DeskForDetail>();
    const createMyDesk = useCallback(async(profileId: string) => {
        const result = await execute(() => createMyDeskAction(profileId));
        if(result.success){
            return result.data;
        }
        toast.error(result.error);
        return null;

    }, [execute]);
   
    return { createMyDesk, error, isLoading};

}