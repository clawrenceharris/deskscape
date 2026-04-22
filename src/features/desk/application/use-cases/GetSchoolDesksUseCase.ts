import { DeskForDetail } from "../../infrastructure/queries";
import { DeskRepository } from "../../domain/repositories";

export class GetSchoolDesksUseCase {
    constructor(private readonly deskRepository: DeskRepository) {}

    async execute(schoolId: string): Promise<DeskForDetail[]> {
        return this.deskRepository.getAll({ where: { schoolId } });
    }
}