import { GetCurrentProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetCurrentProfileUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    return new GetCurrentProfileUseCase(userProfileRepository);
}