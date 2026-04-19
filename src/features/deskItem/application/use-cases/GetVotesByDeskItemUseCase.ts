import { DeskItemRepository } from "../../domain/repositories/DeskItemRepository";
import { GetVotesResult } from "../dto/GetVotesResult";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class GetVotesByDeskItemUseCase {
    constructor(private readonly repository: DeskItemRepository) {}
    async execute(deskItemId: string): Promise<GetVotesResult> {
        try {
            const votes = await this.repository.getVotesByDeskItemId(deskItemId);
            return { success: true, data: votes };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}