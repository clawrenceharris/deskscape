import { GetUserProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaProfileRepository";
import { prisma } from "@/lib/db/prisma";

export async function makeGetProfileUseCase() {
    const userProfileRepository = new PrismaProfileRepository(prisma);
    return new GetUserProfileUseCase(userProfileRepository);
}