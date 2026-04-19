import { DeskRepository } from "../../domain/repositories";
import { GetDesksInput, GetDesksResult } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class GetDesksUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}

    async execute(input?: GetDesksInput): Promise<GetDesksResult> {
        try {
            const desks = await this.deskRepository.getDesks(input);
            return { success: true, data: desks };
        } catch (error) {
            console.error(error);
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}