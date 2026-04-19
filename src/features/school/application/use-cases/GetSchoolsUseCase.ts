import { SchoolRepository } from "../../domain/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { GetSchoolsInput, GetSchoolsResult } from "../dto";

export class GetSchoolsUseCase {
    constructor(private readonly schoolRepository: SchoolRepository) {}

    async execute(input?: GetSchoolsInput): Promise<GetSchoolsResult> {
        try {
            const schools = await this.schoolRepository.getSchools(input);
            return { success: true, data: schools };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}