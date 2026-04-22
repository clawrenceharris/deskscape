import { prisma } from "@/lib/db/prisma";
import { CheckUsernameAvailabilityUseCase } from "@/features/profile/application/use-cases/CheckUsernameAvailabilityUseCase";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaProfileRepository";

export function makeCheckUsernameAvailabilityUseCase() {
    const userProfileRepository = new PrismaProfileRepository(prisma);
    return new CheckUsernameAvailabilityUseCase(userProfileRepository);
}