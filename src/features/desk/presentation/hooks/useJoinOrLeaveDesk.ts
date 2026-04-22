import { deskKeys, schoolKeys } from "@/lib/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  JoinOrLeaveDeskInput } from "../../application/dto";
import { ApplicationError } from "@/shared/kernel";
import { toast } from "sonner";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { joinOrLeaveDeskAction } from "@/actions/desk";
import { useCallback, useState } from "react";
import { useSchoolContext } from "@/app/providers";

export function useJoinOrLeaveDesk() {
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const {currentSchoolId} = useSchoolContext();
    const queryClient = useQueryClient();
    const joinOrLeaveDeskMutation = useMutation({
        mutationKey: ["joinOrLeaveDesk"],
        mutationFn: async (input:  JoinOrLeaveDeskInput) => {
            const result = await joinOrLeaveDeskAction(input);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: deskKeys.members(variables.deskId) });
            queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.deskId) });
            queryClient.invalidateQueries({ queryKey: schoolKeys.detail(currentSchoolId ?? "") });
        },
        onError: (error) => {
            toast.error(getUserErrorMessage(error));
        },
    });
    const joinDesk = useCallback(async (input: { role: "CONTRIBUTOR" | "OWNER" | "VIEWER"}  & JoinOrLeaveDeskInput) => {
        setIsJoining(true);
        await joinOrLeaveDeskMutation.mutateAsync({...input, isJoining: true});
        setIsJoining(false);
    }, [joinOrLeaveDeskMutation]);

    const leaveDesk = useCallback(async (input: JoinOrLeaveDeskInput) => {
        setIsLeaving(true);
        await joinOrLeaveDeskMutation.mutateAsync(input);
        setIsLeaving(false);
    }, [joinOrLeaveDeskMutation]);
    return { joinDesk, leaveDesk, isJoining, isLeaving };
}

