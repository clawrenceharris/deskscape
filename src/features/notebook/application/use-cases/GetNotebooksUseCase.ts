import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";
import { NotebookRepository } from "../../domain/repositories";
import { NotebookForDetail } from "../../infrastructure/queries";
import { GetNotebooksInput } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";



export class GetNotebooksUseCase {
    constructor(private readonly repository: NotebookRepository) {}
    async execute(input?: GetNotebooksInput): Promise<ApplicationResultWithData<NotebookForDetail[]>> {
        try {
            const notebooks = await this.repository.getAll(input);
            return { success: true, data: notebooks };
        } catch (error) {
            return { success: false, error: new ApplicationError(getUserErrorMessage(error))};
        }
    }
}