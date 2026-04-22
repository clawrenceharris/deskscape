import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";
import { DeskRepository } from "../../domain/repositories";
import { SchoolDeskForDetail } from "../../infrastructure/queries";
import { SchoolRepository } from "@/features/school/domain/repositories";

export class CreateSchoolDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository, private readonly schoolRepository: SchoolRepository) {}

    async execute(schoolId: string): Promise<ApplicationResultWithData<SchoolDeskForDetail>> {
        const school = await this.schoolRepository.getSchoolById(schoolId);
        if(!school){
            return { success: false as const, error: new ApplicationError("School not found") };
        }
        const desk = await this.deskRepository.createSchoolDesk(school);
        return { success: true as const, data: desk };
    }
}