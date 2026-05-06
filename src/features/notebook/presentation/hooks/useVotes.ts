"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVotesByNotebookId } from "@/actions/notebook/getVotesByNotebookId";
import { useCallback } from "react";
import { voteNotebookAction } from "@/actions/notebook";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";
import { NotebookVote } from "../../infrastructure/queries/notebookQueries";
import { useUser } from "@/app/providers";
import { notebookKeys } from "@/lib/queries";

export function useVotes(notebookId: string | null) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: notebookKeys.votes(notebookId ?? ""),
        initialData: queryClient.getQueryData(notebookKeys.votes(notebookId ?? "")) as NotebookVote[] | undefined,
        queryFn: async () => {
            if(!notebookId){
                throw new Error("notebookId is required to fetch votes.");
            }
            const result = await getVotesByNotebookId(notebookId);
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            queryClient.setQueryData(notebookKeys.votes(notebookId), result.data);
            return result.data;
        },
        enabled: !!notebookId,
    });
        

}

export const useMakeVote = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const makeVoteMutation = useMutation({
        mutationKey: ["makeVote"],
        mutationFn: async ({notebookId, isUpvote}: {notebookId: string,deskId: string, isUpvote: boolean | null}) => {
            const result = await voteNotebookAction({notebookId, isUpvote});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onMutate: (variables) => {
            // Optimistic update for the vote, handling vote toggle/remove/add
            queryClient.setQueryData(notebookKeys.votes(variables.notebookId), (old: NotebookVote[]) => {
                if (!old) return [];
                const hasVoted = old.some(vote => vote.userId === user.id);

                // If this user has a vote in the list, change or remove it
                return old
                    .map((vote) =>
                        vote.userId === user.id
                            ? variables.isUpvote === null
                                ? null // Remove vote (null out)
                                : { ...vote, isUpvote: variables.isUpvote } // Update vote
                            : vote
                    )
                    .filter(Boolean) // Remove if vote should be deleted (isUpvote === null)
                    // If user didn't have a vote before and isUpvote is not null, add the new vote
                    .concat(
                        !hasVoted && variables.isUpvote !== null
                            ? [{ userId: user.id, isUpvote: variables.isUpvote }]
                            : []
                    );
                });
           
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByDeskId(variables.deskId)});

        },
        onError: (error, variables) => {
            // Rollback optimistic update by invalidating/re-fetching the votes query
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByDeskId(variables.deskId)});
            toast.error(getUserErrorMessage(error));
        },
    });
    
    const removeVoteMutation = useMutation({
        mutationFn: async ({notebookId}: {notebookId: string, deskId: string,}) => {
            
            const result = await voteNotebookAction({notebookId, isUpvote: null});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByDeskId(variables.deskId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});

            
        },
        onError: (error, variables) => {
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByDeskId(variables.deskId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});
            toast.error(getUserErrorMessage(error));
        },
        onMutate: (variables) => {
            
            queryClient.setQueryData(notebookKeys.votes(variables.notebookId), (old: NotebookVote[]) => {
                if (!old) return [];
                return  old.filter((vote) => vote.userId !== user.id);
                
            });
        },
    });



    const makeVote = useCallback((input: {notebookId: string,deskId: string, isUpvote: boolean | null}) => {
        makeVoteMutation.mutate(input);
    }, [makeVoteMutation]);
    const removeVote = useCallback((input: {notebookId: string, deskId: string,}) => {
        removeVoteMutation.mutate(input);
    }, [removeVoteMutation]);
    return {
        makeVote,
        removeVote, 
        isLoading: removeVoteMutation.isPending || makeVoteMutation.isPending, 
        error: removeVoteMutation.error || makeVoteMutation.error
    };
}

