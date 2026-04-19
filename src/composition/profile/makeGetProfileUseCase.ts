import { GetUserProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaUserProfileRepository";
import { prisma } from "@/lib/db/prisma";

export async function makeGetProfileUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    return new GetUserProfileUseCase(userProfileRepository);
}