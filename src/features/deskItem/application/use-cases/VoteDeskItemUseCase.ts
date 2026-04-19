
import { VoteDeskItemInput } from "../dto";
import { DeskItemRepository } from "../../domain/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { getCurrentUser } from "@/features/auth/server";
import { VoteDeskItemResult } from "../dto";

export class VoteDeskItemUseCase {
    constructor(private readonly repository: DeskItemRepository) {}
    async execute(input: VoteDeskItemInput): Promise<VoteDeskItemResult> {
        try {
            const user = await getCurrentUser();
            if (!user) return { success: false, error: "User not found" };
            if(input.isUpvote === null){
                await this.repository.removeVote({
                    deskItemId: input.deskItemId,
                    userId: user.id,
                });
                return { success: true };
            }
            await this.repository.vote({
                deskItemId: input.deskItemId,
                userId: user.id,
                isUpvote: input.isUpvote,
            });
            return { success: true };
        } catch (error) {
            console.error("Error voting desk item", error);
            return {success: false, error: getUserErrorMessage(error)};
        }
    }
}   