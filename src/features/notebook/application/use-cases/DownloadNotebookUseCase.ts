import { ApplicationError, ApplicationResult } from "@/shared/kernel";
import { NotebookRepository } from "../../domain/repositories";
import { DownloadNotebookInput } from "../dto/DownloadNotebookInput";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class DownloadNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input: DownloadNotebookInput): Promise<ApplicationResult> {
        try {
            await this.repository.downloadNotebook(input);
            return { success: true as const };
        } catch (error) {
            console.error("Error downloading notebook", error);
            return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}