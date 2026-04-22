import { deskKeys } from "@/lib/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  JoinOrLeaveDeskInput } from "../../application/dto";
import { ApplicationError } from "@/shared/kernel";
import { toast } from "sonner";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { joinOrLeaveDeskAction } from "@/actions/desk";
import { useCallback } from "react";

export function useJoinOrLeaveDesk() {
    const queryClient = useQueryClient();
    const joinOrLeaveDeskMutation = useMutation({
        mutationKey: ["joinOrLeaveDesk"],
        mutationFn: async (input: JoinOrLeaveDeskInput) => {
            const result = await joinOrLeaveDeskAction(input);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.members(variables.deskId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    const joinDesk = useCallback(async (input: JoinOrLeaveDeskInput, role: "CONTRIBUTOR" | "OWNER" | "VIEWER") => {
        joinOrLeaveDeskMutation.mutate({...input, role, isJoining: true});
    }, [joinOrLeaveDeskMutation]);

    const leaveDesk = useCallback(async (input: JoinOrLeaveDeskInput) => {
        joinOrLeaveDeskMutation.mutate({...input, isJoining: false});
    }, [joinOrLeaveDeskMutation]);
    return { joinDesk, leaveDesk, isLoading: joinOrLeaveDeskMutation.isPending };
}

