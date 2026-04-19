"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVotesByDeskItemId } from "../../server";
import { useCallback } from "react";
import { voteDeskItemAction } from "@/actions/deskItem";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";
import { DeskItemVote } from "../../infrastructure/queries/deskItemQueries";
import { useUser } from "@/app/providers";
import { deskItemKeys, deskKeys } from "@/lib/queries";
import { DeskForDetail } from "@/features/desk/infrastructure/queries/deskQueries";

export function useVotes(deskItemId: string | null) {
    const queryClient = useQueryClient();
    return useQuery({
            queryKey: deskItemKeys.votes(deskItemId ?? ""),
            initialData: queryClient.getQueryData(deskItemKeys.votes(deskItemId ?? "")) as DeskItemVote[] | undefined,
            queryFn: async () => {
                if(!deskItemId){
                    throw new Error("deskItemId is required to fetch votes.");
                }
                const result = await getVotesByDeskItemId(deskItemId);
                if(!result.success){
                    throw new ApplicationError(result.error);
                }
                queryClient.setQueryData(deskItemKeys.votes(deskItemId), result.data);
                return result.data;
            },
            enabled: !!deskItemId,
    });
        

}

export const useMakeVote = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const makeVoteMutation = useMutation({
        mutationKey: ["makeVote"],
        mutationFn: async ({deskItemId, isUpvote}: {deskItemId: string,deskId: string, isUpvote: boolean | null}) => {
            const result = await voteDeskItemAction({deskItemId, isUpvote});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onMutate: (variables) => {
            queryClient.setQueryData(deskKeys.detail(variables.deskId), (old: DeskForDetail) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.map((item) => {
                        if (item.id !== variables.deskItemId) return item;

                        // Find if this user has already voted and what value
                        const existingVoteIndex = item.votes.findIndex(v => v.userId === user.id);
                        const isRemovingVote = variables.isUpvote === null;
                        const newVoteObj = {
                            deskItemId: variables.deskItemId,
                            userId: user.id,
                            isUpvote: variables.isUpvote as boolean
                        };

                        let newVotes;
                        if (existingVoteIndex !== -1) {
                            // User has a previous vote
                            if (isRemovingVote) {
                                // Remove the user's vote (change by -1)
                                newVotes = [
                                    ...item.votes.slice(0, existingVoteIndex),
                                    ...item.votes.slice(existingVoteIndex + 1)
                                ];
                            } else {
                                // User is toggling vote (maybe up to down or vice versa)
                                // If the value is the same, do nothing (shouldn't happen here)
                                // If the value changes (up <-> down), treat as -1 for old +1 for new = net +2 or -2
                                newVotes = [
                                    ...item.votes.slice(0, existingVoteIndex),
                                    { ...item.votes[existingVoteIndex], isUpvote: variables.isUpvote },
                                    ...item.votes.slice(existingVoteIndex + 1)
                                ];
                            }
                        } else {
                            // User didn't vote yet
                            if (!isRemovingVote) {
                                // Add the new vote (change by +1)
                                newVotes = [...item.votes, newVoteObj];
                            } else {
                                // No vote to remove, do nothing
                                newVotes = item.votes;
                            }
                        }

                        return {
                            ...item,
                            votes: newVotes,
                        };
                    }),
                };
            });
            // Optimistic update for the vote, handling vote toggle/remove/add
            queryClient.setQueryData(deskItemKeys.votes(variables.deskItemId), (old: DeskItemVote[]) => {
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
            queryClient.invalidateQueries({queryKey: deskItemKeys.votes(variables.deskItemId)});
            queryClient.invalidateQueries({queryKey: deskItemKeys.listByUserId(user.id)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});

        },
        onError: (error, variables) => {
            // Rollback optimistic update by invalidating/re-fetching the votes query
            queryClient.invalidateQueries({queryKey: deskItemKeys.votes(variables.deskItemId)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: deskItemKeys.listByUserId(user.id)});


            toast.error(getUserErrorMessage(error));
        },
    });
    
    const removeVoteMutation = useMutation({
        mutationFn: async ({deskItemId}: {deskItemId: string, deskId: string,}) => {
            
            const result = await voteDeskItemAction({deskItemId, isUpvote: null});
            if(!result.success){
                throw new ApplicationError(result.error);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: deskItemKeys.votes(variables.deskItemId)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: deskItemKeys.listByUserId(user.id)});
        },
        onError: (error, variables) => {
            queryClient.invalidateQueries({queryKey: deskItemKeys.votes(variables.deskItemId)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: deskItemKeys.listByUserId(user.id)});

            toast.error(getUserErrorMessage(error));
        },
        onMutate: (variables) => {
            queryClient.setQueryData(deskKeys.detail(variables.deskId), (old: DeskForDetail) => {
                if(!old) return old;
                return {
                    ...old,
                    items: old.items.map((item) => {
                        if(item.id === variables.deskItemId){
                            return { ...item, votes: item.votes.filter((vote) => vote.userId !== user.id) };
                        }
                        return item;
                    }),
                };
            });
            queryClient.setQueryData(deskItemKeys.votes(variables.deskItemId), (old: DeskItemVote[]) => {
                if (!old) return [];
                return  old.filter((vote) => vote.userId !== user.id);
                
            });
        },
    });



    const makeVote = useCallback((input: {deskItemId: string,deskId: string, isUpvote: boolean | null}) => {
        makeVoteMutation.mutate(input);
    }, [makeVoteMutation]);
    const removeVote = useCallback((input: {deskItemId: string, deskId: string,}) => {
        removeVoteMutation.mutate(input);
    }, [removeVoteMutation]);
    return {
        makeVote,
        removeVote, 
        isLoading: removeVoteMutation.isPending || makeVoteMutation.isPending, 
        error: removeVoteMutation.error || makeVoteMutation.error
    };
}

