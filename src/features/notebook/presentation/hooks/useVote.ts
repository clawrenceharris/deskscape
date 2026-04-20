"use client";
import { ActionResult } from "@/actions";
import { voteNotebookAction } from "@/actions/notebook";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ApplicationError } from "@/lib/utils/errors";
import { useCallback } from "react";
import { toast } from "sonner";

export function useVote() {
    const { execute, error, isLoading } = useAsyncAction<ActionResult>();  
   
    const vote = useCallback(async (notebookId: string, isUpvote: boolean | null) => {
        try {
            const result = await execute(() => voteNotebookAction({notebookId, isUpvote}));
            if(!result.success){
              throw new ApplicationError(result.error);
            }
          } catch (error) {
            toast.error(getUserErrorMessage(error));
          }
       
    }, [execute]);
    return { vote, error, isLoading };
}