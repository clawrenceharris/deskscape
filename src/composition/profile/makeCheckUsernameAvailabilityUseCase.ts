import { prisma } from "@/lib/db/prisma";
import { CheckUsernameUseCase } from "@/features/profile/application/use-cases/CheckUsernameUseCase";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaUserProfileRepository";

export function makeCheckUsernameAvailabilityUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    return new CheckUsernameUseCase(userProfileRepository);
}