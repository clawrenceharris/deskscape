import { ApplicationError } from "@/lib/utils/errors";
import { ApplicationResult } from "@/shared/kernel";
import { DeskRepository } from "../../domain/repositories";
import { JoinOrLeaveDeskInput } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class JoinDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}

    async execute(input: JoinOrLeaveDeskInput): Promise<ApplicationResult> {
        try {
            await this.deskRepository.join(input);
            return { success: true as const };
        } catch (error) {
            return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}