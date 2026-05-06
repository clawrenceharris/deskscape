
import { VoteNotebookInput } from "../dto";
import { NotebookRepository } from "../../domain/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { ApplicationError, ApplicationResult } from "@/shared/kernel";

export class VoteNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input: VoteNotebookInput): Promise<ApplicationResult> {
        try {
            const user = await getCurrentUser();
            if (!user) return { success: false, error: new ApplicationError("User not found") };
            if(input.isUpvote === null){
                await this.repository.removeVote({
                    notebookId: input.notebookId,
                    userId: user.id,
                });
                return { success: true, };
            }
            await this.repository.vote({
                notebookId: input.notebookId,
                userId: user.id,
                isUpvote: input.isUpvote,
            });
            return { success: true };
        } catch (error) {
            console.error("Error voting notebook", error);
            return {success: false, error: new ApplicationError(getUserErrorMessage(error))};
        }
    }
}   