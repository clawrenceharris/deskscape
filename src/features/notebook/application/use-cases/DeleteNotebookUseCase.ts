import { getUserErrorMessage } from "@/lib/utils/errors";
import { NotebookRepository } from "../../domain/repositories";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";

export class DeleteNotebookUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(id: string): Promise<ApplicationResultWithData<NotebookForDetail>> {
        try {
            const deleted =await this.repository.delete(id);
            return { success: true as const, data: deleted };
        } catch (error) {
            console.error("Error deleting notebook", error);
            return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}