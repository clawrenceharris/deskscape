import { getUserErrorMessage } from "@/lib/utils/errors";
import { DeskItemRepository } from "../../domain/repositories";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
export type DeleteDeskItemResult = {
    success: true;
    data: DeskItemForDetail;
} | {
    success: false;
    error: string;
}   
export class DeleteDeskItemUseCase {
    constructor(private readonly repository: DeskItemRepository) {}
    async execute(id: string): Promise<DeleteDeskItemResult> {
        try {
            const deleted =await this.repository.delete(id);
            return { success: true as const, data: deleted };
        } catch (error) {
            console.error("Error deleting desk item", error);
            return { success: false as const, error: getUserErrorMessage(error) };
        }
    }
}