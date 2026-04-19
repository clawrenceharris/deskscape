import { DeskItemRepository } from "../../domain/repositories";
import { GetDeskItemsInput, GetDeskItemsResult } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class GetDeskItemsUseCase {
    constructor(private readonly repository: DeskItemRepository) {}
    async execute(input?: GetDeskItemsInput): Promise<GetDeskItemsResult> {
        try {
            const deskItems = await this.repository.getAll(input);
            return { success: true, data: deskItems };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}