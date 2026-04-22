import { GetCurrentProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetCurrentProfileUseCase() {
    const userProfileRepository = new PrismaProfileRepository(prisma);
    return new GetCurrentProfileUseCase(userProfileRepository);
}