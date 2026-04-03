"use server"
import { GetUserProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories/PrismaUserProfileRepository";
import { prisma } from "@/lib/db/prisma";

export async function makeGetUserProfileUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    return new GetUserProfileUseCase(userProfileRepository);
}