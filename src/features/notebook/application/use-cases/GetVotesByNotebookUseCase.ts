import { NotebookRepository } from "../../domain/repositories/NotebookRepository";
import { NotebookVote } from "../../infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";


export type GetVotesResult = {
    success: true;
    data: NotebookVote[];
} | {
    success: false;
    error: string;
}

export class GetVotesByNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(notebookId: string): Promise<GetVotesResult> {
        try {
            const votes = await this.repository.getVotesByNotebookId(notebookId);
            return { success: true, data: votes };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}