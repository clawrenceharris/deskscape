import { PrismaSchoolRepository } from "@/features/school/infrastructure/repositories/PrismaSchoolRepository";
import { GetSchoolsUseCase } from "@/features/school/application/use-cases";
import { prisma } from "@/lib/db/prisma";

export const makeGetAllSchoolsUseCase = () => {
    const schoolRepository = new PrismaSchoolRepository(prisma);
    return new GetSchoolsUseCase(schoolRepository);
}