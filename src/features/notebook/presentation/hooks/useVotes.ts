"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVotesByNotebookId } from "../../server";
import { useCallback } from "react";
import { voteNotebookAction } from "@/actions/notebook";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";
import { NotebookVote } from "../../infrastructure/queries/notebookQueries";
import { useUser } from "@/app/providers";
import { notebookKeys, deskKeys } from "@/lib/queries";
import { DeskForDetail } from "@/features/desk/infrastructure/queries/deskQueries";

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
            queryClient.setQueryData(deskKeys.detail(variables.deskId), (old: DeskForDetail) => {
                if (!old) return old;
                return {
                    ...old,
                    notebooks: old.notebooks.map((notebook) => {
                        if (notebook.id !== variables.notebookId) return notebook;

                        // Find if this user has already voted and what value
                        const existingVoteIndex = notebook.votes.findIndex(v => v.userId === user.id);
                        const isRemovingVote = variables.isUpvote === null;
                        const newVoteObj = {
                            notebookId: variables.notebookId,
                            userId: user.id,
                            isUpvote: variables.isUpvote as boolean
                        };

                        let newVotes;
                        if (existingVoteIndex !== -1) {
                            // User has a previous vote
                            if (isRemovingVote) {
                                // Remove the user's vote (change by -1)
                                newVotes = [
                                    ...notebook.votes.slice(0, existingVoteIndex),
                                    ...notebook.votes.slice(existingVoteIndex + 1)
                                ];
                            } else {
                                // User is toggling vote (maybe up to down or vice versa)
                                // If the value is the same, do nothing (shouldn't happen here)
                                // If the value changes (up <-> down), treat as -1 for old +1 for new = net +2 or -2
                                newVotes = [
                                    ...notebook.votes.slice(0, existingVoteIndex),
                                    { ...notebook.votes[existingVoteIndex], isUpvote: variables.isUpvote },
                                    ...notebook.votes.slice(existingVoteIndex + 1)
                                ];
                            }
                        } else {
                            // User didn't vote yet
                            if (!isRemovingVote) {
                                // Add the new vote (change by +1)
                                newVotes = [...notebook.votes, newVoteObj];
                            } else {
                                // No vote to remove, do nothing
                                newVotes = notebook.votes;
                            }
                        }

                        return {
                            ...notebook,
                            votes: newVotes,
                        };
                    }),
                };
            });
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
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});

        },
        onError: (error, variables) => {
            // Rollback optimistic update by invalidating/re-fetching the votes query
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});


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
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});
        },
        onError: (error, variables) => {
            queryClient.invalidateQueries({queryKey: notebookKeys.votes(variables.notebookId)});
            queryClient.invalidateQueries({queryKey: deskKeys.detail(variables.deskId)});
            queryClient.invalidateQueries({queryKey: notebookKeys.listByUserId(user.id)});

            toast.error(getUserErrorMessage(error));
        },
        onMutate: (variables) => {
            queryClient.setQueryData(deskKeys.detail(variables.deskId), (old: DeskForDetail) => {
                if(!old) return old;
                return {
                    ...old,
                    notebooks: old.notebooks.map((notebook) => {
                        if(notebook.id === variables.notebookId){
                            return { ...notebook, votes: notebook.votes.filter((vote) => vote.userId !== user.id) };
                        }
                        return notebook;
                    }),
                };
            });
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

