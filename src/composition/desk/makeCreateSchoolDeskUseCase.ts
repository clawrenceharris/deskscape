import { prisma } from "@/lib/db/prisma";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { PrismaSchoolRepository } from "@/features/school/infrastructure/repositories";
import { CreateSchoolDeskUseCase } from "@/features/desk/application/use-cases";

export function makeCreateSchoolDeskUseCase() {
    const deskRepository = new PrismaDeskRepository(prisma);
    const schoolRepository = new PrismaSchoolRepository(prisma);
    return new CreateSchoolDeskUseCase(deskRepository, schoolRepository);
}