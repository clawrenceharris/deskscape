import { DeskItemRepository } from "../../domain/repositories";
import { DownloadDeskItemInput } from "../dto/DownloadDeskItemInput";
import { DownloadDeskItemResult } from "../dto/DownloadDeskItemResult";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class DownloadDeskItemUseCase {
    constructor(private readonly repository: DeskItemRepository) {}
    async execute(input: DownloadDeskItemInput): Promise<DownloadDeskItemResult> {
        try {
            await this.repository.downloadDeskItem(input);
            return { success: true as const };
        } catch (error) {
            console.error("Error downloading desk item", error);
            return { success: false as const, error: getUserErrorMessage(error) };
        }
    }
}