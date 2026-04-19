import { prisma } from "@/lib/db/prisma";
import { CheckUsernameAvailabilityUseCase } from "@/features/profile/application/use-cases/CheckUsernameAvailabilityUseCase";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaUserProfileRepository";

export function makeCheckUsernameAvailabilityUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    return new CheckUsernameAvailabilityUseCase(userProfileRepository);
}